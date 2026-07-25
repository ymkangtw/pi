//const { sequelize } = require('../models');
const db = require('../models');

async function getAll(req, res) {
	let querystr = 
		"select teamno, name " +
		"from uteam " + 
		"order by teamno asc";

	const rows = await db.sequelize.query(querystr, { type: db.QueryTypes.SELECT });	
	if (rows) {
		res.status(200).json(rows);
	} else {
		res.status(404).send('error');
	}
};

async function getBy(req, res) {
	// query string 的 key 會直接串進 SQL（值有 bind、key 沒有），只允許 model 宣告的欄位名，防 SQL Injection
	const allowedKeys = Object.keys(db.uteam.rawAttributes);
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
		"select teamno, name " +
		"from uteam " + 
		wherestr +
		"order by teamno asc";

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
		await db.uteam.create(val, { transaction: t });
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
		if (['teamno'].indexOf(key) === -1) {
			updateobj[key] = val[key];;
		}
	}
	const t = await db.sequelize.transaction();
	try {
		await db.uteam.update(updateobj, {
			where: {
				teamno: val.teamno
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
		await db.uteam.destroy({
			where: {
				teamno: val.teamno
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
