module.exports = (app) => {
	const monthbyitemapi = require('../ctrl/monthbyitem.ctrl');
	var router = require('express').Router();
	console.log('load monthbyitem api');
	// select all
	router.get('/', monthbyitemapi.getAll);
	// select by id
	router.get('/getby', monthbyitemapi.getBy);
	// select by id
	router.get('/getyearmonth', monthbyitemapi.getYearMonth);
	// create
	router.post('/', monthbyitemapi.create);
	// update
	router.put('/', monthbyitemapi.update);
	// delete
	router.delete('/', monthbyitemapi.remove);
	// delete all monthitem by project
	router.delete('/removeall', monthbyitemapi.removeAll);

	app.use('/api/monthbyitem', router);

};