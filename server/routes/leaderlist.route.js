module.exports = (app) => {
	const leaderlistapi = require('../ctrl/leaderlist.ctrl');
	var router = require('express').Router();
	console.log('load leaderlist api');
	
	// select by id
	router.get('/getby', leaderlistapi.getBy);

	app.use('/api/leaderlist', router);

};