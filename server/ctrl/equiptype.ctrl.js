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

	//let str = req.query.typeid;
	//console.log(str.slice(-1));
	let str = req.query.typeid;
	let eq1 = str.slice(-1) == '%' ? 'like' : '=';

	//console.log(eq, str);
	let querystr = "select * from equiptype where ";
	let appendstr = "";

	let eq;
	let queryobj = {};
	for(const key in req.query) {
		eq = req.query[key].slice(-1) == '%' ? 'like' : '=';
		appendstr = appendstr + `${key} ${eq} :${key} and `;
		queryobj[key] = req.query[key];
	}
	querystr = querystr + appendstr.slice(0, -5);
	console.log(querystr);
	console.log(queryobj);

	const rows = await db.sequelize.query(
			//"select * from equiptype where typeid " + eq1 + " :typeid",
			querystr,
			{
				//replacements: { typeid: req.query.typeid },
				replacements: queryobj,
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
