//const { sequelize } = require('../models');
const db = require('../models');

async function getAll(req, res) {
	let querystr =
		"select jobno, subjobno, yearmonth, " +
		"id_lmn_mh, id_lmn_dwg, id_accu_mh, id_accu_dwg, id_esti_prg, id_prg, " +
		"bd_lmn_mh, bd_lmn_dwg, bd_accu_mh, bd_accu_dwg, bd_esti_prg, bd_prg, " +
		"dd_lmn_mh, dd_lmn_dwg, dd_accu_mh, dd_accu_dwg, dd_esti_prg, dd_prg, " +
		"cnt_lmn_mh, cnt_lmn_dwg, cnt_accu_mh, cnt_accu_dwg, cnt_esti_prg, cnt_prg, " +
		"buy_lmn_mh, buy_lmn_dwg, buy_accu_mh, buy_accu_dwg, buy_esti_prg, buy_prg, " +
		"con_lmn_mh, con_accu_mh, con_esti_prg, con_prg, " +
		"com_lmn_mh, com_accu_mh, com_esti_prg, com_prg, " +
		"dcs_lmn_mh, dcs_lmn_dwg, dcs_accu_mh, dcs_accu_dwg, dcs_esti_prg, dcs_prg, " +
		"plc_lmn_mh, plc_lmn_dwg, plc_accu_mh, plc_accu_dwg, plc_esti_prg, plc_prg, " +
		"rpt_lmn_mh, rpt_lmn_dwg, rpt_accu_mh, rpt_accu_dwg, rpt_esti_prg, rpt_prg, " +
		"prg_esti, prg, prg_design_esti, prg_design, ifupdated, monthwork " +
		"from monthbyproject " +
		"order by jobno, subjobno, yearmonth asc";
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
		"select jobno, subjobno, yearmonth, " +
		"id_lmn_mh, id_lmn_dwg, id_accu_mh, id_accu_dwg, id_esti_prg, id_prg, " +
		"bd_lmn_mh, bd_lmn_dwg, bd_accu_mh, bd_accu_dwg, bd_esti_prg, bd_prg, " +
		"dd_lmn_mh, dd_lmn_dwg, dd_accu_mh, dd_accu_dwg, dd_esti_prg, dd_prg, " +
		"cnt_lmn_mh, cnt_lmn_dwg, cnt_accu_mh, cnt_accu_dwg, cnt_esti_prg, cnt_prg, " +
		"buy_lmn_mh, buy_lmn_dwg, buy_accu_mh, buy_accu_dwg, buy_esti_prg, buy_prg, " +
		"con_lmn_mh, con_accu_mh, con_esti_prg, con_prg, " +
		"com_lmn_mh, com_accu_mh, com_esti_prg, com_prg, " +
		"dcs_lmn_mh, dcs_lmn_dwg, dcs_accu_mh, dcs_accu_dwg, dcs_esti_prg, dcs_prg, " +
		"plc_lmn_mh, plc_lmn_dwg, plc_accu_mh, plc_accu_dwg, plc_esti_prg, plc_prg, " +
		"rpt_lmn_mh, rpt_lmn_dwg, rpt_accu_mh, rpt_accu_dwg, rpt_esti_prg, rpt_prg, " +
		"prg_esti, prg, prg_design_esti, prg_design, ifupdated, monthwork " +
		"from monthbyproject where " + condstr +
		"order by jobno, subjobno, yearmonth asc";

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
		await db.monthbyproject.create(val, { transaction: t });
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
		await db.monthbyproject.update(updateobj, {
			where: {
				jobno: val.jobno,
				subjobno: val.subjobno,
				yearmonth: val.yearmonth
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
		await db.monthbyproject.destroy({
			where: {
				jobno: val.jobno,
				subjobno: val.subjobno,
				yearmonth: val.yearmonth
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
		await db.monthbyproject.destroy({
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
