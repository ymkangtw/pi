module.exports = (app) => {
	const monthprgbyprojecttotalapi = require('../ctrl/monthprgbyprojecttotal.ctrl');
	var router = require('express').Router();
	console.log('load monthprgbyprojecttotal api');
	// select all
	router.get('/', monthprgbyprojecttotalapi.getAll);
	// select by id
	router.get('/getby', monthprgbyprojecttotalapi.getBy);
	// create
	router.post('/', monthprgbyprojecttotalapi.create);
	// update
	router.put('/', monthprgbyprojecttotalapi.update);
	// delete
	router.delete('/', monthprgbyprojecttotalapi.remove);
	// delete all monthprgbyprojecttotal by project
	router.delete('/removeall', monthprgbyprojecttotalapi.removeAll);

	app.use('/api/monthprgbyprojecttotal', router);

};