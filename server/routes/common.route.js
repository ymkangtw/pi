module.exports = (app) => {
	const commonapi = require('../ctrl/common.ctrl');
	var router = require('express').Router();
	console.log('load common api');
	// get KPI by user
	router.get('/getkpibyuser', commonapi.getKPIByUser);
	router.get('/getprjinprogress', commonapi.getPrjinprogress);
	router.get('/getpersonaljobs', commonapi.getPersonalJobs);

	router.get('/getestimateamount', commonapi.getEstimateamount);
	router.get('/getpurchaseesti', commonapi.getPurchaseEsti);
	router.get('/getpurchase', commonapi.getPurchase);
	router.get('/getorderesti', commonapi.getOrderEsti);
	router.get('/getorder', commonapi.getOrder);
	router.get('/getdeliveryesti', commonapi.getDeliveryEsti);
	router.get('/getdelivery', commonapi.getDelivery);
	router.get('/getreceivecheckesti', commonapi.getReceiveCheckEsti);
	router.get('/getreceivecheck', commonapi.getReceiveCheck);

	router.get('/getotsumbyteam', commonapi.getOTSumByTeam);
	router.get('/getotsumbyuser', commonapi.getOTSumByUser);
	router.get('/getotlistbyuser', commonapi.getOTListByUser);
	router.get('/getotlist', commonapi.getOTList);

	app.use('/api/common', router);

};