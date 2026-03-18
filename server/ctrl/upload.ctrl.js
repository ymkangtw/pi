//const { sequelize } = require('../models');
//const db = require('../models');
//const Op = db.Op;
const fs = require('fs-extra');

async function upload(req, res) {
	//console.log(req.body.data);
	
	//console.log(req.file);
	//req.file.buffer.toString('latin1')
	console.log(req.files);
	//var file = req.file
	//fs.createWriteStream(req.file).write(file)

	//req.files.forEach((file) => {
	//	console.log(file)
	//});

	try {
		//await db.equiptype.upsert({
		//	typeid: req.body.data.typeid,
		//	typename: req.body.data.typename
		//}, { transaction: t });

		res.status(201).send('created').end();
	} catch (error) {

		console.log('insert error! ' + error);
		res.status(404).send(`Bad request: param ID: ${val.jobno}`);
	};
};

/*
async function upload(req, res) {
	//console.log(req.body.data);
	
	console.log(req.files);
	try {
		//await db.equiptype.upsert({
		//	typeid: req.body.data.typeid,
		//	typename: req.body.data.typename
		//}, { transaction: t });

		res.status(201).send('created').end();
	} catch (error) {

		console.log('insert error! ' + error);
		res.status(404).send(`Bad request: param ID: ${val.jobno}`);
	};
};
*/
async function removeupload(req, res) {
	let val = req.body;
	try {
		/*
		await db.leader.destroy({
			where: {
				jobno: val.jobno,
				employeeno: val.employeeno
			}
		}, { transaction: t });
		await t.commit();
		*/
		res.status(201).send('removed').end();
	} catch (error) {
		//await t.rollback();
		console.log('delete error! ' + error);
		//res.status(404).send(`Bad request: param ID: ${req.body.data.jobno}`);
		res.status(404).send('error');
	};
};

module.exports = {
	upload,
	removeupload
};
