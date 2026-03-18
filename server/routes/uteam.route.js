module.exports = (app) => {
	const uteamapi = require('../ctrl/uteam.ctrl');
	var router = require('express').Router();
	console.log('load uteam api');
	// select all
	router.get('/', uteamapi.getAll);
	// select by id
	router.get('/getby', uteamapi.getBy);
	// create
	router.post('/', uteamapi.create);
	// update
	router.put('/', uteamapi.update);
	// delete
	router.delete('/', uteamapi.remove);

	app.use('/api/uteam', router);

};