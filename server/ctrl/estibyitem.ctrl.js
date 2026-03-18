//const { sequelize } = require('../models');
const db = require('../models');

async function getAll(req, res) {
   	let querystr =
		"select e.jobno, e.subjobno, e.jobid, t.content, e.esti_dwg, e.esti_mh, " +
		//"FORMAT(e.esti_start_date, 'yyyy-MM-dd') as esti_start_date, " +
		//"FORMAT(e.start_date, 'yyyy-MM-dd') as start_date, " +
		//"FORMAT(e.esti_fin_date, 'yyyy-MM-dd') as esti_fin_date, " +
		//"FORMAT(e.fin_date, 'yyyy-MM-dd') as fin_date, " +

		"convert(varchar(10), e.esti_start_date, 120) as esti_start_date, " +
		"convert(varchar(10), e.start_date, 120) as start_date, " +
		"convert(varchar(10), e.esti_fin_date, 120) as esti_fin_date, " +
		"convert(varchar(10), e.fin_date, 120) as fin_date, " +

		"e.design_type, e.dwgno, e.classcode, e.listorder " +
		"from estibyitem e inner join task t on e.jobid = t.jobid " +
		"order by e.jobno, e.subjobno, e.jobid asc";

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
		condstr = condstr + `${'e.'}${key} ${eq} $${key} and `;
	}
	condstr = condstr.slice(0, -4); //slice " and ".len()
	let querystr =
		"select e.jobno, e.subjobno, e.jobid, t.content, e.esti_dwg, e.esti_mh, " +
		//"FORMAT(e.esti_start_date, 'yyyy-MM-dd') as esti_start_date, " +
		//"FORMAT(e.start_date, 'yyyy-MM-dd') as start_date, " +
		//"FORMAT(e.esti_fin_date, 'yyyy-MM-dd') as esti_fin_date, " +
		//"FORMAT(e.fin_date, 'yyyy-MM-dd') as fin_date, " +
		"convert(varchar(10), e.esti_start_date, 120) as esti_start_date, " +
		"convert(varchar(10), e.start_date, 120) as start_date, " +
		"convert(varchar(10), e.esti_fin_date, 120) as esti_fin_date, " +
		"convert(varchar(10), e.fin_date, 120) as fin_date, " +
		"e.design_type, e.dwgno, e.classcode, e.listorder " +
		"from estibyitem e inner join task t on e.jobid = t.jobid " +
		"where " + condstr +
		"order by e.jobno, e.subjobno, e.jobid asc";

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
		await db.estibyitem.create(val, { transaction: t });
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
		if (['jobno', 'subjobno', 'jobid'].indexOf(key) === -1) {
			updateobj[key] = val[key];
		}
	}
	const t = await db.sequelize.transaction();
	try {
		await db.estibyitem.update(updateobj, {
			where: {
				jobno: val.jobno,
				subjobno: val.subjobno,
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
		await db.estibyitem.destroy({
			where: {
				jobno: val.jobno,
				subjobno: val.subjobno,
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
		await db.estibyitem.destroy({
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
