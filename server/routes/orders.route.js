module.exports = (app) => {
	const ordersapi = require('../ctrl/orders.ctrl');
	var router = require('express').Router();
	console.log('load orders api');
	// select all
	router.get('/', ordersapi.getAll);
	// select by id
	router.get('/getby', ordersapi.getBy);
	// create
	router.post('/', ordersapi.create);
	// update
	router.put('/', ordersapi.update);
	// delete
	router.delete('/', ordersapi.remove);
	// delete all orders by project
	router.delete('/removeall', ordersapi.removeAll);

	app.use('/api/orders', router);

};