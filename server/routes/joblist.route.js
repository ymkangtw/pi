module.exports = (app) => {
	const joblistapi = require('../ctrl/joblist.ctrl');
	var router = require('express').Router();
	console.log('load joblist api');
	// select all
	router.get('/', joblistapi.getAll);
	// select by id
	router.get('/getby', joblistapi.getBy);

	router.get('/getbyteam', joblistapi.getByTeam);

	router.get('/getbyleader', joblistapi.getByLeader);

	router.get('/getbymember', joblistapi.getByMember);

	router.get('/getbyallteammember', joblistapi.getByAllTeamMember);

	router.get('/getByIdreport', joblistapi.getByIdreport);

	router.get('/getByFnreport', joblistapi.getByFnreport);

	app.use('/api/joblist', router);

};