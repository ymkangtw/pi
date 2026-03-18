//const { sequelize } = require('../models');
const db = require('../models');

async function getAll(req, res) {
/*
	let querystr =
		"select jobno, subjobno, yearmonth, jobid, " +
		"lmn_mh, lmn_dwg, accu_mh, accu_dwg, esti_prg, act_prg " +
		"from monthbyitem " +
		"order by jobno, subjobno, yearmonth, jobid asc";
*/
	let querystr =
		"select m.jobno, m.subjobno, m.yearmonth, m.jobid, t.content, " +
		"m.lmn_mh, m.lmn_dwg, m.accu_mh, m.accu_dwg, m.esti_prg, m.act_prg " +
		"from monthbyitem m inner join task t on m.jobid = t.jobid " +
		"order by m.jobno, m.subjobno, m.yearmonth, m.jobid asc";

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
	let condstr = "";1
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
		condstr = condstr + `${'m.'}${key} ${eq} $${key} and `;
	}
	condstr = condstr.slice(0, -4); //slice " and ".len()
/*
	let querystr =
		"select jobno, subjobno, yearmonth, jobid, " +
		"lmn_mh, lmn_dwg, accu_mh, accu_dwg, esti_prg, act_prg " +
		"from monthbyitem where " + condstr +
		"order by jobno, subjobno, yearmonth, jobid asc";
*/
	let querystr =
		"select m.jobno, m.subjobno, m.yearmonth, m.jobid, t.content, " +
		"m.lmn_mh, m.lmn_dwg, m.accu_mh, m.accu_dwg, m.esti_prg, m.act_prg " +
		"from monthbyitem m inner join task t on m.jobid = t.jobid " +
		"where " + condstr +
		"order by m.jobno, m.subjobno, m.yearmonth, m.jobid asc";

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

async function getYearMonth(req, res) {
	let eq;
	let queryobj = {};
	let condstr = "";1
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
		"select distinct(yearmonth) " +
		"from monthbyitem where " + condstr +
		"order by yearmonth desc";

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
		await db.monthbyitem.create(val, { transaction: t });
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
		if (['jobno', 'subjobno', 'yearmonth', 'jobid'].indexOf(key) === -1) {
			updateobj[key] = val[key];
		}
	}
	const t = await db.sequelize.transaction();
	try {
		await db.monthbyitem.update(updateobj, {
			where: {
				jobno: val.jobno,
				subjobno: val.subjobno,
				yearmonth: val.yearmonth,
				jobid: val.jobid
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
		await db.monthbyitem.destroy({
			where: {
				jobno: val.jobno,
				subjobno: val.subjobno,
				yearmonth: val.yearmonth,
				jobid: val.jobid
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
		await db.monthbyitem.destroy({
			where: {
				jobno: val.jobno
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
	getYearMonth,
	create,
	update,
	remove,
	removeAll
};
