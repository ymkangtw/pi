module.exports = (app) => {
	const memberlistapi = require('../ctrl/memberlist.ctrl');
	var router = require('express').Router();
	console.log('load memberlist api');
	
	// select by id
	router.get('/getby', memberlistapi.getBy);

	app.use('/api/memberlist', router);

};