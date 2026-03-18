module.exports = (app) => {
	const leaderapi = require('../ctrl/leader.ctrl');
	var router = require('express').Router();
	console.log('load leader api');
	// select all
	router.get('/', leaderapi.getAll);
	// select by id
	router.get('/getby', leaderapi.getBy);
	// create
	router.post('/', leaderapi.create);
	// update
	router.put('/', leaderapi.update);
	// delete
	router.delete('/', leaderapi.remove);
	// delete all leader by project
	router.delete('/removeall', leaderapi.removeAll);

	app.use('/api/leader', router);

};