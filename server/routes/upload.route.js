module.exports = (app) => {
	const uploadapi = require('../ctrl/upload.ctrl');
	const router = require('express').Router();
	const multer = require('multer');
	const path = require('path');
	//const encoding = require('encoding');
	const iconv = require('iconv-lite');
	//iconv.skipDecodeWarning = true;
	const fs = require('fs');

	//var uploadpath = "d:\\upload\\";
	var uploadpath = "d:\\upload\\";
	
	var updir = "";

	const storage = multer.diskStorage({
		destination: async (req, res, cb) => {
			//cb(null, './upload');
			//updir = uploadpath + req.body.jobno + "\\";
			updir = uploadpath;
			//console.log(path.resolve(__dirname, '../client/dist'));

			await fs.mkdir(updir, function(error) {
				if (error) {
					console.log('mkdir error');
				} else {
					console.log('mkdir success');
				}
			});			
			/*
			await fs.access(updir, function(error) {
				if (error) {
					console.log('dir not exist');
					await fs.mkdir(updir, function(error) {
						if (error) {
							console.log('mkdir error');
						} else {
							console.log('mkdir success');
						}
					});
				} else {
					console.log('dir exist');
				}
				
			});
			*/
			//console.log(req.body);
			cb(null, updir);
		},
		filename: (req, res, cb) => {
			//let newFilename = encoding.convert(res.originalname, "Latin_1").toString();
			
			//let newFilename = iconv.decode(res.originalname, "utf8");
			let newFilename = iconv.decode(Buffer.from(res.originalname, "latin1"), "utf8");
			//console.log(newFilename.toString());

			//cb(null, res.originalname);
			cb(null, newFilename);
		}
	});
	const upload = multer({storage: storage});
	//const upload = multer({dest: './upload'});

	console.log('load upload api');
	// upload
	//router.post('/', upload.single('file'), uploadapi.upload);
	router.post('/', upload.array('file'), uploadapi.upload);
	router.delete('/', uploadapi.removeupload);

	app.use('/api/upload', router);

};