module.exports = (app) => {
	const utilapi = require('../ctrl/util.ctrl');
	var router = require('express').Router();
	console.log('load util api');
	// create weekly report
	router.post('/weekreportbygroup', utilapi.weekreportbygroup);
	// download file	
	router.get('/downloadfile', utilapi.downloadfile);	
	
	router.post('/orderreport', utilapi.orderreport);

	app.use('/api/util', router);

};