//const { sequelize } = require('../models');
const db = require('../models');

async function getAll(req, res) {
	let querystr =
		"select m.jobno, m.subjobno, m.employeeno, e.name, e.titleid, e.ofgroup1, m.weight, " +
		//"FORMAT(m.begindate, 'yyyy-MM-dd') as begindate, " +
		//"FORMAT(m.enddate, 'yyyy-MM-dd') as enddate, " +
		"convert(varchar(10), m.begindate, 120) as begindate, " +
		"convert(varchar(10), m.enddate, 120) as enddate, " +

		"m.note " +
		"from member m inner join employee e on m.employeeno = e.employeeno " +
		"order by m.jobno, m.subjobno asc";

	const rows = await db.sequelize.query(querystr, { type: db.QueryTypes.SELECT });
	if (rows) {
		res.status(200).json(rows);
	} else {
		res.status(404).send('404 - Not found');
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
		condstr = condstr + `m.${key} ${eq} $${key} and `;
	}
	condstr = condstr.slice(0, -4); //slice " and ".len()
	let querystr =
		"select m.jobno, m.subjobno, m.employeeno, e.name, e.titleid, e.ofgroup1, m.weight, " +
		//"FORMAT(m.begindate, 'yyyy-MM-dd') as begindate, " +
		//"FORMAT(m.enddate, 'yyyy-MM-dd') as enddate, " +
		"convert(varchar(10), m.begindate, 120) as begindate, " +
		"convert(varchar(10), m.enddate, 120) as enddate, " +

		"m.note " +
		"from member m inner join employee e on m.employeeno = e.employeeno " +
		"where " + condstr +
		"order by m.jobno, m.subjobno asc";

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
		res.status(404).send('404 - Not found');
	}
};

async function create(req, res) {
	let val = req.body.data;
	console.log(val);
	const t = await db.sequelize.transaction();
	try {
		await db.member.create(val, { transaction: t });
		await t.commit();
		res.status(201).send('created').end();
	} catch (error) {
		await t.rollback();
		console.log('insert error! ' + error);
		res.status(404).send(`Bad request: param ID: ${val.jobno}`);
	};
};

async function update(req, res) {
	let val = req.body.data;
	let updateobj = {};
	for(const key in val) {
		//if (key !== 'jobno') {
		if (['jobno', 'employeeno'].indexOf(key) === -1) {
			updateobj[key] = val[key];
		}
	}
	const t = await db.sequelize.transaction();
	try {
		await db.member.update(updateobj, {
			where: {
				jobno: val.jobno,
				employeeno: val.employeeno
			},
			transaction: t
		});
		await t.commit();
		res.status(201).send('updated').end();
	} catch (error) {
		await t.rollback();
		console.log('update error! ' + error);
		res.status(404).send(`Bad request: param ID: ${val.jobno}`);
	};

};

async function remove(req, res) {
	let val = req.body;
	const t = await db.sequelize.transaction();
	try {
		await db.member.destroy({
			where: {
				jobno: val.jobno,
				employeeno: val.employeeno
			},
			transaction: t
		});
		await t.commit();
		res.status(201).send('removed').end();
	} catch (error) {
		await t.rollback();
		console.log('delete error! ' + error);
		res.status(404).send(`Bad request: param ID: ${val.jobno}`);
	};
};

async function removeAll(req, res) {
	let val = req.body;
	const t = await db.sequelize.transaction();
	try {
		await db.member.destroy({
			where: {
				jobno: val.jobno,
				//employeeno: val.employeeno
			},
			transaction: t
		});
		await t.commit();
		res.status(201).send('removed').end();
	} catch (error) {
		await t.rollback();
		console.log('delete error! ' + error);
		res.status(404).send(`Bad request: param ID: ${val.jobno}`);
	};
};

module.exports = {
	getAll,
	getBy,
	create,
	update,
	remove,
	removeAll
};
