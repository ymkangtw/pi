module.exports = (app) => {
	const equipapi= require('../ctrl/equip.ctrl');
	var router = require('express').Router();
	console.log('load equip api');
	// select all
	router.get('/', equipapi.getAll);
	// select by id
	router.get('/:typeid', equipapi.getById);
	// create
	router.post('/:typeid', equipapi.create);
	// update
	router.put('/', equipapi.update);
	// delete
	router.delete('/', equipapi.remove);

	app.use('/api/equip', router);

};