//const { sequelize } = require('../models');
const db = require('../models');

async function getAll(req, res) {
	let querystr =
		"select jobno, yearmonth, prg_esti, prg, prg_design_esti, prg_design, " +
		"y6ncntestiprg, y6ncntprg, y6nconestiprg, y6nconprg, " +
		"y69estiprg, y69prg, worksummaried, worksummariednext, " +
		"tracesummaried, isoprogressdescription, y6nwork, y6nrequest " +
		"from monthprgbyprojecttotal " +
		"order by yearmonth, jobno asc";
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
		condstr = condstr + `${key} ${eq} $${key} and `;
	}
	condstr = condstr.slice(0, -4); //slice " and ".len()

	let querystr =
		"select jobno, yearmonth, prg_esti, prg, prg_design_esti, prg_design, " +
		"y6ncntestiprg, y6ncntprg, y6nconestiprg, y6nconprg, " +
		"y69estiprg, y69prg, worksummaried, worksummariednext, " +
		"tracesummaried, isoprogressdescription, y6nwork, y6nrequest " +
		"from monthprgbyprojecttotal where " + condstr +
		"order by yearmonth, jobno asc";

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
	//console.log(val);
	const t = await db.sequelize.transaction();
	try {
		await db.monthprgbyprojecttotal.create(val, { transaction: t });
		await t.commit();
		res.status(201).send('created').end();
	} catch (error) {
		await t.rollback();
		console.log('insert error! ' + error);
		res.status(404).send(`Bad request: param ID: ${val.jobno} ${val.yearmonth}`);
	};
};


async function update(req, res) {
	let val = req.body.data;
	let updateobj = {};
	for(const key in val) {
		if (['jobno', 'yearmonth'].indexOf(key) === -1) {
			updateobj[key] = val[key];
		}
	}
	const t = await db.sequelize.transaction();
	try {
		await db.monthprgbyprojecttotal.update(updateobj, {
			where: {
				jobno: val.jobno,
				yearmonth: val.yearmonth
			},
			transaction: t
		});
		await t.commit();
		res.status(201).send('updated').end();
	} catch (error) {
		await t.rollback();
		console.log('update error! ' + error);
		res.status(404).send(`Bad request: param ID: ${val.jobno} ${val.yearmonth}`);
	};

};

async function remove(req, res) {
	let val = req.body;
	const t = await db.sequelize.transaction();
	try {
		await db.monthprgbyprojecttotal.destroy({
			where: {
				jobno: val.jobno,
				yearmonth: val.yearmonth
			},
			transaction: t
		});
		await t.commit();
		res.status(201).send('removed').end();
	} catch (error) {
		await t.rollback();
		console.log('delete error! ' + error);
		res.status(404).send(`Bad request: param ID: ${val.jobno} ${val.yearmonth}`);
	};
};

async function removeAll(req, res) {
	let val = req.body;
	const t = await db.sequelize.transaction();
	try {
		await db.monthprgbyprojecttotal.destroy({
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
	create,
	update,
	remove,
	removeAll
};
