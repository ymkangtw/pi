const db = require('../models');
const Op = db.Op;

async function getAll(req, res) {
	//const equips = await models.equip.findAll();
	console.log('equip getAll');
	const rows = await db.equip.findAll({
		attributes: ['equipid', 'typeid', 'equipno'],
		order: [
			['equipid', 'asc']
		]
	});
	res.status(200).json(rows);
};

async function getById(req, res) {
	//const equip = await models.equip.findByPk(id);
	const typeid = req.params.typeid;
	const rows = await db.equip.findAll({
		attributes: ['equipid', 'typeid', 'equipno'],
		where: {
			typeid: { [Op.like]: `${typeid}%` }
		},
		order: [
			['equipid', 'asc']
		]
	});
	if (rows) {
		res.status(200).json(rows);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function create(req, res) {
	const t = await db.sequelize.transaction();
	try {
		await db.equip.upsert({
			equipid: req.body.data.newequipid,
			typeid: req.body.data.newtypeid,
			equipno: req.body.data.newequipno
		}, { transaction: t });
		await t.commit();
	} catch(error) {
		await t.rollback();
		console.log('insert error! ' + error);
	};

	res.status(201).json(req.body.data).end();
};


async function update(req, res) {

	const t = await db.sequelize.transaction();
	try {
		await db.equip.update({
			//equipid: req.body.data.newequipid,
			typeid: req.body.data.newtypeid,
			equipno: req.body.data.newequipno
		}, {
			where: {
				equipid: req.body.data.newequipid
			},
			transaction: t
		});
		await t.commit();
		res.status(200).end();
	} catch(error) {
		await t.rollback();
		console.log('update error! ' + error);
		res.status(400).send(`Bad request: param ID (${req.body.data.newequipid}) does not match body ID (${req.body.data.newequipid}).`);
	};

};

async function remove(req, res) {
	console.log(req.body);
	const t = await db.sequelize.transaction();
	try {
		await db.equip.destroy({
			where: {
				equipid: req.body.newequipid
			},
			transaction: t
		});
		await t.commit();
		res.status(200).end();
	} catch(error) {
		await t.rollback();
		console.log('delete error! ' + error);
		res.status(400).send(`Bad request: param ID (${req.body.data.newequipid}) does not match body ID (${req.body.data.newequipid}).`);
	};

};

module.exports = {
	getAll,
	getById,
	create,
	update,
	remove
};
