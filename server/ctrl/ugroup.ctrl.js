//const { sequelize } = require('../models');
const db = require('../models');

async function getAll(req, res) {
	let querystr = 
		"select groupno, ofteam, name " +
		"from ugroup " + 
		"order by groupno asc";

	const rows = await db.sequelize.query(querystr, { type: db.QueryTypes.SELECT });	
	if (rows) {
		res.status(200).json(rows);
	} else {
		res.status(404).send('error');
	}
};

async function getBy(req, res) {
	let eq;
	let queryobj = {};
	let condstr = "";
	for(const key in req.query) {
		let val = req.query[key];

		if (val.slice(-1) == '%') {
			eq = 'like';
			queryobj[key] = '%' + val;
		} else if (val == '' || val == null) {
			eq = 'like';
			queryobj[key] = '%';
		} else {
			eq = '=';
			queryobj[key] = val;
		}
		condstr = condstr + `${key} ${eq} $${key} and `;
	}
	condstr = condstr.slice(0, -4); //slice " and ".len()
	let querystr = 
		"select groupno, ofteam, name " +
		"from ugroup " + 
		"where " + condstr +		
		"order by groupno asc";

	const rows = await db.sequelize.query(
		querystr,
		{
			bind: queryobj,
			type: db.QueryTypes.SELECT 
		}
	);

	if (rows) {
		res.status(200).json(rows);
	} else {
		res.status(404).send('error');
	}
};

async function create(req, res) {
	let val = req.body.data;
	const t = await db.sequelize.transaction();
	try {
		await db.ugroup.create(val, { transaction: t });
		await t.commit();
		res.status(201).send('created').end();
	} catch (error) {
		await t.rollback();
		console.log('insert error! ' + error);
		//res.status(404).send(`Bad request: param ID: ${val.jobno}`);
		res.status(404).send('error');
	};
};


async function update(req, res) {
	let val = req.body.data;
	let updateobj = {};
	for(const key in val) {
		//if (key !== 'jobno') {
		if (['groupno'].indexOf(key) === -1) {
			updateobj[key] = val[key];;
		}
	}
	const t = await db.sequelize.transaction();
	try {
		await db.ugroup.update(updateobj, {
			where: {
				groupno: val.groupno
			},
			transaction: t
		});
		await t.commit();
		res.status(201).send('updated').end();
	} catch (error) {
		await t.rollback();
		console.log('update error! ' + error);
		//res.status(404).send(`Bad request: param ID: ${req.body.data.jobno}`);
		res.status(404).send('error');
	};

};

async function remove(req, res) {
	let val = req.body;
	const t = await db.sequelize.transaction();
	try {
		await db.ugroup.destroy({
			where: {
				groupno: val.groupno
			},
			transaction: t
		});
		await t.commit();
		res.status(201).send('removed').end();
	} catch (error) {
		await t.rollback();
		console.log('delete error! ' + error);
		//res.status(404).send(`Bad request: param ID: ${req.body.data.jobno}`);
		res.status(404).send('error');
	};
};

module.exports = {
	getAll,
	getBy,
	create,
	update,
	remove
};
