module.exports = (app) => {
	const orderitemsapi = require('../ctrl/orderitems.ctrl');
	var router = require('express').Router();
	console.log('load orderitems api');
	// select all
	router.get('/', orderitemsapi.getAll);
	// select by id
	router.get('/getby', orderitemsapi.getBy);
	// create
	router.post('/', orderitemsapi.create);
	// update
	router.put('/', orderitemsapi.update);
	// delete
	router.delete('/', orderitemsapi.remove);
	// delete all orderitems by project
	router.delete('/removeall', orderitemsapi.removeAll);

	app.use('/api/orderitems', router);

};