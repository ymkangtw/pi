module.exports = (app) => {
	const ugroupapi = require('../ctrl/ugroup.ctrl');
	var router = require('express').Router();
	console.log('load ugroup api');
	// select all
	router.get('/', ugroupapi.getAll);
	// select by id
	router.get('/getby', ugroupapi.getBy);
	// create
	router.post('/', ugroupapi.create);
	// update
	router.put('/', ugroupapi.update);
	// delete
	router.delete('/', ugroupapi.remove);

	app.use('/api/ugroup', router);

};