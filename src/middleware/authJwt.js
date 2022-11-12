import jsonwebtoken from "jsonwebtoken";
import authConfig from "../config/auth.config";

const verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jsonwebtoken.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const validateTokenFE = (req, res) => {
  let token = req.body.token;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jsonwebtoken.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    res.status(200).send({ message: "Token is Exist" });
  });
};

const authJwt = {
  verifyToken,
  validateTokenFE,
};

export default authJwt;
