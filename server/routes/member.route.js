module.exports = (app) => {
	const memberapi = require('../ctrl/member.ctrl');
	var router = require('express').Router();
	console.log('load member api');
	// select all
	router.get('/', memberapi.getAll);
	// select by id
	router.get('/getby', memberapi.getBy);
	// create
	router.post('/', memberapi.create);
	// update
	router.put('/', memberapi.update);
	// delete
	router.delete('/', memberapi.remove);
	// delete all member by project
	router.delete('/removeall', memberapi.removeAll);

	app.use('/api/member', router);

};