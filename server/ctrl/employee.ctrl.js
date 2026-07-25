//const { sequelize } = require('../models');
const db = require('../models');

async function getAll(req, res) {
	let querystr =
		"select employeeno, name, ofgroup, titleid, " +
		//"FORMAT(birthday, 'yyyy-MM-dd') as birthday, " +
		"convert(varchar(10), birthday, 120) as birthday, " +
		"address, phone, mobilephone, email, " +
		//"FORMAT(ofy6tdate, 'yyyy-MM-dd') as ofy6tdate, " +
		//"FORMAT(ofcscdate, 'yyyy-MM-dd') as ofcscdate, " +
		"convert(varchar(10), ofy6tdate, 120) as ofy6tdate, " +
		"convert(varchar(10), ofcscdate, 120) as ofcscdate, " +
		"title, state, ofgroup1 " +
		"from employee " +
		"order by employeeno asc";
	const rows = await db.sequelize.query(querystr, { type: db.QueryTypes.SELECT });
	if (rows) {
		res.status(200).json(rows);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getBy(req, res) {
	// query string 的 key 會直接串進 SQL（值有 bind、key 沒有），只允許 model 宣告的欄位名，防 SQL Injection
	const allowedKeys = Object.keys(db.employee.rawAttributes);
	let queryobj = {};
	let conds = [];
	for(const key in req.query) {
		if (allowedKeys.indexOf(key) === -1) {
			return res.status(400).send(`Bad request: unknown field ${key}`);
		}
		let val = req.query[key];

		if (val.slice(-1) == '%') {
			conds.push(`${key} like $${key}`);
			queryobj[key] = '%' + val;
		} else if (val == '' || val == null) {
			conds.push(`${key} like $${key}`);
			queryobj[key] = '%';
		} else {
			conds.push(`${key} = $${key}`);
			queryobj[key] = val;
		}
	}
	// 不帶任何參數時省略 where 子句，避免產生壞 SQL
	let wherestr = conds.length ? "where " + conds.join(" and ") + " " : "";
	let querystr =
		"select employeeno, name, ofgroup, titleid, " +
		//"FORMAT(birthday, 'yyyy-MM-dd') as birthday, " +
		"convert(varchar(10), birthday, 120) as birthday, " +
		"address, phone, mobilephone, email, " +
		//"FORMAT(ofy6tdate, 'yyyy-MM-dd') as ofy6tdate, " +
		//"FORMAT(ofcscdate, 'yyyy-MM-dd') as ofcscdate, " +
		"convert(varchar(10), ofy6tdate, 120) as ofy6tdate, " +
		"convert(varchar(10), ofcscdate, 120) as ofcscdate, " +
		"title, state, ofgroup1 " +
		"from employee " + wherestr +
		"order by employeeno asc";

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
	const t = await db.sequelize.transaction();
	try {
		await db.employee.create(val, { transaction: t });
		await t.commit();
		res.status(201).send('created').end();
	} catch (error) {
		await t.rollback();
		console.log('insert error! ' + error);
		res.status(404).send(`Bad request: param ID: ${val.employeeno}`);
	};
};


async function update(req, res) {
	let val = req.body.data;
	let updateobj = {};
	for(const key in val) {
		if (key !== 'employeeno') {
			updateobj[key] = val[key];
		}
	}
	const t = await db.sequelize.transaction();
	try {
		await db.employee.update(updateobj, {
			where: {
				employeeno: val.employeeno
			},
			transaction: t
		});
		await t.commit();
		res.status(201).send('updated').end();
	} catch (error) {
		await t.rollback();
		console.log('update error! ' + error);
		res.status(404).send(`Bad request: param ID: ${val.employeeno}`);
	};

};

async function remove(req, res) {
	let val = req.body;
	const t = await db.sequelize.transaction();
	try {
		await db.employee.destroy({
			where: {
				employeeno: val.employeeno
			},
			transaction: t
		});
		await t.commit();
		res.status(201).send('removed').end();
	} catch (error) {
		await t.rollback();
		console.log('delete error! ' + error);
		res.status(404).send(`Bad request: param ID: ${val.employeeno}`);
	};
};

module.exports = {
	getAll,
	getBy,
	create,
	update,
	remove
};
