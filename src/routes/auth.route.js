import bcryptjs from "bcryptjs";
import { Router } from "express";
import jsonwebtoken from "jsonwebtoken";
import authConfig from "../config/auth.config";
import authJwt from "../middleware/authJwt";
import verifySignUp from "../middleware/verifySignup";
import User from "../models/user";

const router = Router();

router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail],
  (req, res) => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      device_id: "",
      password: bcryptjs.hashSync(req.body.password, 8),
    });

    var token = jsonwebtoken.sign({ id: user.id }, authConfig.secret, {
      expiresIn: 1800,
    });

    req.session.token = token;

    user.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        token: token,
      });
    });
  }
);

router.post("/signin", (req, res) => {
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcryptjs.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }

    var token = jsonwebtoken.sign({ id: user.id }, authConfig.secret, {
      expiresIn: 1800,
    });

    req.session.token = token;

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      token: token,
    });
  });
});

router.post("/signout", (req, res, next) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    next(err);
  }
});

router.post("/check-token", [authJwt.verifyToken], (req, res) => {
  const userId = req.userId;

  User.findById(userId, "email device_id username _id").exec((err, user) => {
    if (err) {
      res.status(404).send({ message: "User not Found for given token" });
    }

    res.status(200).send(user);
  });
});

router.put("/upsert", [authJwt.verifyToken], (req, res) => {
  const userId = req.userId;

  const { device_id } = req.body;
  const query = { _id: userId };
  const upsertData = {
    device_id: device_id,
  };

  User.findOneAndUpdate(query, upsertData, { upsert: true }, function (err) {
    if (err) return res.status(500).send({ error: err });
    return res.send("Succesfully saved.");
  });
});

export default router;
