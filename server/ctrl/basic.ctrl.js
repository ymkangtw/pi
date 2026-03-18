//const { sequelize } = require('../models');
const db = require('../models');
//const Op = db.Op;

async function getAll(req, res) {
	let querystr =
		"select jobno, projectno, jobname, appdept, approvalno, jobtype, joborderno, size, "+
		"status, idealreportno, finalreportno, techfield, ownerdept, ownername, " +
		"designtype, budgetyearst, budgetyearsp, " +
		"replace(convert(nvarchar, cast(totalbudget as money), 1), '.00', '') as totalbudget, " +
		"replace(convert(nvarchar, cast(electricalbudget as money), 1), '.00', '') as electricalbudget, " +
		"replace(convert(nvarchar, cast(y6tbudget as money), 1), '.00', '') as y6tbudget, " +
		"replace(convert(nvarchar, cast(budgetequipment as money), 1), '.00', '') as budgetequipment, " +
		"replace(convert(nvarchar, cast(budgetdesign as money), 1), '.00', '') as budgetdesign, " +
		"replace(convert(nvarchar, cast(y6nbudget as money), 1), '.00', '') as y6nbudget, " +
		"replace(convert(nvarchar, cast(y6nexpense as money), 1), '.00', '') as y6nexpense, " +
		"replace(convert(nvarchar, cast(w61budget as money), 1), '.00', '') as w61budget, " +
		"replace(convert(nvarchar, cast(w61expense as money), 1), '.00', '') as w61expense, " +
		"replace(convert(nvarchar, cast(budgety6turnkey as money), 1), '.00', '') as budgety6turnkey, " +
		"esti_mh, esti_dwg, " +
		//"FORMAT(esti_start_date, 'yyyy-MM-dd') as esti_start_date, " +
		//"FORMAT(esti_fin_date, 'yyyy-MM-dd') as esti_fin_date, " +
		//"FORMAT(act_start_date, 'yyyy-MM-dd') as act_start_date, " +
		//"FORMAT(act_fin_date, 'yyyy-MM-dd') as act_fin_date " +
		"convert(varchar(10), esti_start_date, 120) as esti_start_date, " +
		"convert(varchar(10), esti_fin_date, 120) as esti_fin_date, " +
		"convert(varchar(10), act_start_date, 120) as act_start_date, " +
		"convert(varchar(10), act_fin_date, 120) as act_fin_date " +
		"from basic " +
		"order by jobno asc";
	const rows = await db.sequelize.query(querystr, { type: db.QueryTypes.SELECT });
	if (rows) {
		res.status(200).json(rows);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getBy(req, res) {
	let appendstr = "";
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
		"select jobno, projectno, jobname, appdept, approvalno, jobtype, joborderno, size, " +
		"status, idealreportno, finalreportno, techfield, ownerdept, ownername, " +
		"designtype, budgetyearst, budgetyearsp, " +
		"replace(convert(nvarchar, cast(totalbudget as money), 1), '.00', '') as totalbudget, " +
		"replace(convert(nvarchar, cast(electricalbudget as money), 1), '.00', '') as electricalbudget, " +
		"replace(convert(nvarchar, cast(y6tbudget as money), 1), '.00', '') as y6tbudget, " +
		"replace(convert(nvarchar, cast(budgetequipment as money), 1), '.00', '') as budgetequipment, " +
		"replace(convert(nvarchar, cast(budgetdesign as money), 1), '.00', '') as budgetdesign, " +
		"replace(convert(nvarchar, cast(y6nbudget as money), 1), '.00', '') as y6nbudget, " +
		"replace(convert(nvarchar, cast(y6nexpense as money), 1), '.00', '') as y6nexpense, " +
		"replace(convert(nvarchar, cast(w61budget as money), 1), '.00', '') as w61budget, " +
		"replace(convert(nvarchar, cast(w61expense as money), 1), '.00', '') as w61expense, " +
		"replace(convert(nvarchar, cast(budgety6turnkey as money), 1), '.00', '') as budgety6turnkey, " +
		"esti_mh, esti_dwg, " +
		//"FORMAT(esti_start_date, 'yyyy-MM-dd') as esti_start_date, " +
		//"FORMAT(esti_fin_date, 'yyyy-MM-dd') as esti_fin_date, " +
		//"FORMAT(act_start_date, 'yyyy-MM-dd') as act_start_date, " +
		//"FORMAT(act_fin_date, 'yyyy-MM-dd') as act_fin_date " +
		"convert(varchar(10), esti_start_date, 120) as esti_start_date, " +
		"convert(varchar(10), esti_fin_date, 120) as esti_fin_date, " +
		"convert(varchar(10), act_start_date, 120) as act_start_date, " +
		"convert(varchar(10), act_fin_date, 120) as act_fin_date " +
		"from basic where " + condstr +
		"order by jobno asc";

	const rows = await db.sequelize.query(
			//"select * from equiptype where typeid " + eq1 + " :typeid",
			querystr,
			{
				//replacements: { typeid: req.query.typeid },
				//replacements: queryobj,
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
	//console.log(req.body.data);
	let val = req.body.data;
	const t = await db.sequelize.transaction();
	try {
		//await db.equiptype.upsert({
		//	typeid: req.body.data.typeid,
		//	typename: req.body.data.typename
		//}, { transaction: t });
		await db.basic.create(val, { transaction: t });
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
		if (key !== 'jobno') {
			updateobj[key] = val[key];
		}
	}
	const t = await db.sequelize.transaction();
	try {
		await db.basic.update(updateobj, {
			where: {
				jobno: val.jobno
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
		await db.basic.destroy({
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
	remove
};
