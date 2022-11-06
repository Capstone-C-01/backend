var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Plant = require('../models/plant');
var Device = require('../models/device');
var SystemControll = require('../models/systemcontroll');
var SetSystemControll = require('../models/setsystemcontroll');


router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});


router.post('/', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are regestered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"user_id":data._id});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('data.ejs', {"name":data.username,"email":data.email});
		}
	});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});

// Plant routes
router.get('/plant', function(req, res) {
	Plant.findOne({user_id:req.body.user_id}, function(err, data){
		if(!data){
			res.send({"Status":"Can't found"});
		} else{
			res.send({
				"plant_id": data._id,
				"plant_name": data.plant_name,
				"date_planted": data.date_planted,
				"plant_count": data.plant_count,
			})
		}
	})
})

router.post('/plant/add', function(req, res){
	let plantInfo = req.body;

	var newPlant = new Plant({
		user_id: plantInfo.user_id,
		device_id: plantInfo.device_id,
		plant_name: plantInfo.plant_name,
		date_planted: plantInfo.date_planted,
		plant_count: plantInfo.plant_count
	});
	newPlant.save(function(err, Plant){
		if(err)
			res.send(err);
		else
			res.send(Plant);
	});
})


// Device routes
router.get('/dashboarddevicedata', function(req, res) {
	Device.findOne({user_id:req.body.user_id, device_id:req.body.device_id}, function(err, data){
		if(!data){
			res.send({"Status":"Can't found"});
		} else{
			res.send({
				"user_id": data._id,
				"device_id": data.device_id,
				"placement": data.placement,
				"lamp_status": data.lamp_status,
				"water_level": data.water_level,
				"ph_data": data.ph_data,
				"tds_data": data.tds_data
			})
		}
	})
})

router.post('/dashboarddevicedata/add', function(req, res){
	let deviceInfo = req.body;

	var newDevice = new Device({
		user_id: deviceInfo.user_id,
		device_id: deviceInfo.device_id,
		placement: deviceInfo.placement,
		lamp_status: deviceInfo.lamp_status,
		water_level: deviceInfo.water_level,
		ph_data: deviceInfo.ph_data,
		tds_data: deviceInfo.tds_data
	});
	newDevice.save(function(err, Device){
		if(err)
			res.send(err);
		else
			res.send(Device);
	});
})


// SystemControll routes
router.get('/systemcontrolldeviceedata', function(req, res) {
	SystemControll.findOne({user_id:req.body.user_id}, function(err, data){
		if(!data){
			res.send({"Status":"Can't found"});
		} else{
			res.send({
				"user_id": data._id,
				"device_id": data.device_id,
				"lamp_status": data.lamp_status,
				"ph_min": data.ph_min,
				"ph_max": data.ph_max,
				"tds_min": data.tds_min,
				"tds_max": data.tds_max,
				"spray_interval": data.spray_interval,
				"spray_duration": data.spray_duration
			})
		}
	})
})

router.post('/systemcontrolldeviceedata/add', function(req, res){
	let systemcontrollInfo = req.body;

	var newSystemControll = new SystemControll({
		user_id: systemcontrollInfo.user_id,
		device_id: systemcontrollInfo.device_id,
		lamp_status: systemcontrollInfo.lamp_status,
		ph_min: systemcontrollInfo.ph_min,
		ph_max: systemcontrollInfo.ph_max,
		tds_min: systemcontrollInfo.tds_min,
		tds_max: systemcontrollInfo.tds_max,
		spray_interval: systemcontrollInfo.spray_interval,
		spray_duration: systemcontrollInfo.spray_duration
	});
	newSystemControll.save(function(err, SystemControll){
		if(err)
			res.send(err);
		else
			res.send(SystemControll);
	});
})

// getreportdata routes
router.get('/reportdata', function(req, res) {
	Device.findOne({user_id:req.body.user_id, device_id:req.body.device_id}, function(err, data){
		if(!data){
			res.send({"Status":"Can't found"});
		} else{
			res.send({
				"user_id": data._id,
				"device_id": data.device_id,
				"lamp_status": data.lamp_status,
				"water_level": data.water_level,
				"ph_data": data.ph_data,
				"tds_data": data.tds_data
			})
		}
	})
})

router.post('/setSystemControll/add', function(req, res){
	let setsystemcontrollInfo = req.body;

	var newSetSystemControll = new SetSystemControll({
		user_id: setsystemcontrollInfo.user_id,
		device_id: setsystemcontrollInfo.device_id,
		lamp_status: setsystemcontrollInfo.lamp_status,
		ph_min: setsystemcontrollInfo.ph_min,
		ph_max: setsystemcontrollInfo.ph_max,
		tds_min: setsystemcontrollInfo.tds_min,
		tds_max: setsystemcontrollInfo.tds_max,
		spray_interval: setsystemcontrollInfo.spray_interval,
		spray_duration: setsystemcontrollInfo.spray_duration,
		plant_count: setsystemcontrollInfo.plant_count	
	});
	newSetSystemControll.save(function(err, SetSystemControll){
		if(err)
			res.send(err);
		else
			res.send(SetSystemControll);
	});
})


module.exports = router;