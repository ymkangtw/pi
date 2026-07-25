const db = require('../models');
const Op = db.Op;

async function getAll(req, res) {
	console.log('equiptype getAll');
	const rows = await db.equiptype.findAll({
		attributes: ['typeid', 'typename'],
		order: [
			['typeid', 'asc']
		]
	});
	if (rows) {
		res.status(200).json(rows);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getBy(req, res) {
	//console.log('params: ' + req.params.typeid);
	//console.log();
	/*
		const rows = await db.equiptype.findAll({
			attributes: ['typeid', 'typename'],
			where: {
				typeid: { [Op.like]: req.params.typeid + '%' }
				//typename: { []: req.params.typename }
			},
			order: [
				['typeid', 'asc']
			]
		});
	*/
	/*
	var str1, str2;
	for (const key in req.query) {
		str1 = key;
		str2 = req.query[key];
		//console.log(str1, str2)
		console.log(`${key} , ${req.query[key]}`);
	}
	*/
	//console.log('query: ' + req.query);

	// query string 的 key 會直接串進 SQL（值有 bind、key 沒有），只允許 model 宣告的欄位名，防 SQL Injection
	const allowedKeys = Object.keys(db.equiptype.rawAttributes);
	let queryobj = {};
	let conds = [];
	for(const key in req.query) {
		if (allowedKeys.indexOf(key) === -1) {
			return res.status(400).send(`Bad request: unknown field ${key}`);
		}
		let val = req.query[key];
		conds.push(val.slice(-1) == '%' ? `${key} like $${key}` : `${key} = $${key}`);
		queryobj[key] = val;
	}
	// 不帶任何參數時省略 where 子句（行為同 getAll），避免產生壞 SQL
	let wherestr = conds.length ? "where " + conds.join(" and ") : "";
	let querystr = "select * from equiptype " + wherestr;

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
	//console.log('create data');
	const t = await db.sequelize.transaction();
	try {
		//await db.equiptype.upsert({
		//	typeid: req.body.data.typeid,
		//	typename: req.body.data.typename
		//}, { transaction: t });
		await db.equiptype.upsert(req.body.data, { transaction: t });
		await t.commit();
		res.status(201).end();
	} catch (error) {
		await t.rollback();
		console.log('insert error! ' + error);
		res.status(404).send(`Bad request: param ID: ${req.body.data.typeid}`);
	};
};


async function update(req, res) {
	const t = await db.sequelize.transaction();
	try {
		await db.equiptype.update({
			typename: req.body.data.typename
		}, {
			where: {
				typeid: req.body.data.typeid
			},
			transaction: t
		});
		await t.commit();
		res.status(201).end();
	} catch (error) {
		await t.rollback();
		console.log('update error! ' + error);
		res.status(404).send(`Bad request: param ID: ${req.body.data.typeid}`);
	};

};

async function remove(req, res) {
	const t = await db.sequelize.transaction();
	try {
		await db.equiptype.destroy({
			where: {
				typeid: req.body.typeid
			},
			transaction: t
		});
		await t.commit();
		res.status(201).end();
	} catch (error) {
		await t.rollback();
		console.log('delete error! ' + error);
		res.status(404).send(`Bad request: param ID: ${req.body.data.typeid}`);
	};
};

module.exports = {
	getAll,
	getBy,
	create,
	update,
	remove
};
