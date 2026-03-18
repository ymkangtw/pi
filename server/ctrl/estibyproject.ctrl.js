//const { sequelize } = require('../models');
const db = require('../models');

async function getAll(req, res) {
	let querystr =
		"select jobno, subjobno, " +
		"id_esti_mh, id_esti_dwg, " +
		//"FORMAT(id_esti_start_date, 'yyyy-MM-dd') as id_esti_start_date, " +
		//"FORMAT(id_start_date, 'yyyy-MM-dd') as id_start_date, " +
		//"FORMAT(id_esti_fin_date, 'yyyy-MM-dd') as id_esti_fin_date, " +
		//"FORMAT(id_fin_date, 'yyyy-MM-dd') as id_fin_date, " +
		"convert(varchar(10), id_esti_start_date, 120) as id_esti_start_date, " +
		"convert(varchar(10), id_start_date, 120) as id_start_date, " +
		"convert(varchar(10), id_esti_fin_date, 120) as id_esti_fin_date, " +
		"convert(varchar(10), id_fin_date, 120) as id_fin_date, " +

		"id_wt, id_type, " +
		"bd_esti_mh, bd_esti_dwg, " +
		//"FORMAT(bd_esti_start_date, 'yyyy-MM-dd') as bd_esti_start_date, " +
		//"FORMAT(bd_start_date, 'yyyy-MM-dd') as bd_start_date, " +
		//"FORMAT(bd_esti_fin_date, 'yyyy-MM-dd') as bd_esti_fin_date, " +
		//"FORMAT(bd_fin_date, 'yyyy-MM-dd') as bd_fin_date, " +
		"convert(varchar(10), bd_esti_start_date, 120) as bd_esti_start_date, " +
		"convert(varchar(10), bd_start_date, 120) as bd_start_date, " +
		"convert(varchar(10), bd_esti_fin_date, 120) as bd_esti_fin_date, " +
		"convert(varchar(10), bd_fin_date, 120) as bd_fin_date, " +

		"bd_wt, bd_type, " +
		"dd_esti_mh, dd_esti_dwg, " +
		//"FORMAT(dd_esti_start_date, 'yyyy-MM-dd') as dd_esti_start_date, " +
		//"FORMAT(dd_start_date, 'yyyy-MM-dd') as dd_start_date, " +
		//"FORMAT(dd_esti_fin_date, 'yyyy-MM-dd') as dd_esti_fin_date, " +
		//"FORMAT(dd_fin_date, 'yyyy-MM-dd') as dd_fin_date, " +
		"convert(varchar(10), dd_esti_start_date, 120) as dd_esti_start_date, " +
		"convert(varchar(10), dd_start_date, 120) as dd_start_date, " +
		"convert(varchar(10), dd_esti_fin_date, 120) as dd_esti_fin_date, " +
		"convert(varchar(10), dd_fin_date, 120) as dd_fin_date, " +

		"dd_wt, dd_type, " +
		"cnt_esti_mh, cnt_esti_dwg, " +
		//"FORMAT(cnt_esti_start_date, 'yyyy-MM-dd') as cnt_esti_start_date, " +
		//"FORMAT(cnt_start_date, 'yyyy-MM-dd') as cnt_start_date, " +
		//"FORMAT(cnt_esti_fin_date, 'yyyy-MM-dd') as cnt_esti_fin_date, " +
		//"FORMAT(cnt_fin_date, 'yyyy-MM-dd') as cnt_fin_date, " +
		"convert(varchar(10), cnt_esti_start_date, 120) as cnt_esti_start_date, " +
		"convert(varchar(10), cnt_start_date, 120) as cnt_start_date, " +
		"convert(varchar(10), cnt_esti_fin_date, 120) as cnt_esti_fin_date, " +
		"convert(varchar(10), cnt_fin_date, 120) as cnt_fin_date, " +

		"cnt_wt, cnt_type, " +
		"dcs_esti_mh, dcs_esti_dwg, " +
		//"FORMAT(dcs_esti_start_date, 'yyyy-MM-dd') as dcs_esti_start_date, " +
		//"FORMAT(dcs_start_date, 'yyyy-MM-dd') as dcs_start_date, " +
		//"FORMAT(dcs_esti_fin_date, 'yyyy-MM-dd') as dcs_esti_fin_date, " +
		//"FORMAT(dcs_fin_date, 'yyyy-MM-dd') as dcs_fin_date, " +
		"convert(varchar(10), dcs_esti_start_date, 120) as dcs_esti_start_date, " +
		"convert(varchar(10), dcs_start_date, 120) as dcs_start_date, " +
		"convert(varchar(10), dcs_esti_fin_date, 120) as dcs_esti_fin_date, " +
		"convert(varchar(10), dcs_fin_date, 120) as dcs_fin_date, " +

		"dcs_wt, dcs_type, " +
		"plc_esti_mh, plc_esti_dwg, " +
		//"FORMAT(plc_esti_start_date, 'yyyy-MM-dd') as plc_esti_start_date, " +
		//"FORMAT(plc_start_date, 'yyyy-MM-dd') as plc_start_date, " +
		//"FORMAT(plc_esti_fin_date, 'yyyy-MM-dd') as plc_esti_fin_date, " +
		//"FORMAT(plc_fin_date, 'yyyy-MM-dd') as plc_fin_date, " +
		"convert(varchar(10), plc_esti_start_date, 120) as plc_esti_start_date, " +
		"convert(varchar(10), plc_start_date, 120) as plc_start_date, " +
		"convert(varchar(10), plc_esti_fin_date, 120) as plc_esti_fin_date, " +
		"convert(varchar(10), plc_fin_date, 120) as plc_fin_date, " +

		"plc_wt, plc_type, " +
		"buy_esti_mh, buy_esti_dwg, " +
		//"FORMAT(buy_esti_start_date, 'yyyy-MM-dd') as buy_esti_start_date, " +
		//"FORMAT(buy_start_date, 'yyyy-MM-dd') as buy_start_date, " +
		//"FORMAT(buy_esti_fin_date, 'yyyy-MM-dd') as buy_esti_fin_date, " +
		//"FORMAT(buy_fin_date, 'yyyy-MM-dd') as buy_fin_date, " +
		"convert(varchar(10), buy_esti_start_date, 120) as buy_esti_start_date, " +
		"convert(varchar(10), buy_start_date, 120) as buy_start_date, " +
		"convert(varchar(10), buy_esti_fin_date, 120) as buy_esti_fin_date, " +
		"convert(varchar(10), buy_fin_date, 120) as buy_fin_date, " +

		"buy_wt, buy_type, " +
		"con_esti_mh, " +
		//"FORMAT(con_esti_start_date, 'yyyy-MM-dd') as con_esti_start_date, " +
		//"FORMAT(con_start_date, 'yyyy-MM-dd') as con_start_date, " +
		//"FORMAT(con_esti_fin_date, 'yyyy-MM-dd') as con_esti_fin_date, " +
		//"FORMAT(con_fin_date, 'yyyy-MM-dd') as con_fin_date, " +
		"convert(varchar(10), con_esti_start_date, 120) as con_esti_start_date, " +
		"convert(varchar(10), con_start_date, 120) as con_start_date, " +
		"convert(varchar(10), con_esti_fin_date, 120) as con_esti_fin_date, " +
		"convert(varchar(10), con_fin_date, 120) as con_fin_date, " +

		"con_wt, con_type, " +
		"com_esti_mh, " +
		//"FORMAT(com_esti_start_date, 'yyyy-MM-dd') as com_esti_start_date, " +
		//"FORMAT(com_start_date, 'yyyy-MM-dd') as com_start_date, " +
		//"FORMAT(com_esti_fin_date, 'yyyy-MM-dd') as com_esti_fin_date, " +
		//"FORMAT(com_fin_date, 'yyyy-MM-dd') as com_fin_date, " +
		"convert(varchar(10), com_esti_start_date, 120) as com_esti_start_date, " +
		"convert(varchar(10), com_start_date, 120) as com_start_date, " +
		"convert(varchar(10), com_esti_fin_date, 120) as com_esti_fin_date, " +
		"convert(varchar(10), com_fin_date, 120) as com_fin_date, " +

		"com_wt, com_type, " +
		"rpt_esti_mh, rpt_esti_dwg, " +
		//"FORMAT(rpt_esti_start_date, 'yyyy-MM-dd') as com_esti_start_date, " +
		//"FORMAT(rpt_start_date, 'yyyy-MM-dd') as com_start_date, " +
		//"FORMAT(rpt_esti_fin_date, 'yyyy-MM-dd') as com_esti_fin_date, " +
		//"FORMAT(rpt_fin_date, 'yyyy-MM-dd') as com_fin_date, " +
		"convert(varchar(10), rpt_esti_start_date, 120) as com_esti_start_date, " +
		"convert(varchar(10), rpt_start_date, 120) as com_start_date, " +
		"convert(varchar(10), rpt_esti_fin_date, 120) as com_esti_fin_date, " +
		"convert(varchar(10), rpt_fin_date, 120) as com_fin_date, " +

		"rpt_wt, rpt_type, " +
		"estiprogresstext, estiprogresstexty6n " +
		"from estibyproject " +
		"order by jobno, subjobno asc";
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
	"select jobno, subjobno, " +
	"id_esti_mh, id_esti_dwg, " +
	//"FORMAT(id_esti_start_date, 'yyyy-MM-dd') as id_esti_start_date, " +
	//"FORMAT(id_start_date, 'yyyy-MM-dd') as id_start_date, " +
	//"FORMAT(id_esti_fin_date, 'yyyy-MM-dd') as id_esti_fin_date, " +
	//"FORMAT(id_fin_date, 'yyyy-MM-dd') as id_fin_date, " +
	"convert(varchar(10), id_esti_start_date, 120) as id_esti_start_date, " +
	"convert(varchar(10), id_start_date, 120) as id_start_date, " +
	"convert(varchar(10), id_esti_fin_date, 120) as id_esti_fin_date, " +
	"convert(varchar(10), id_fin_date, 120) as id_fin_date, " +

	"id_wt, id_type, " +
	"bd_esti_mh, bd_esti_dwg, " +
	//"FORMAT(bd_esti_start_date, 'yyyy-MM-dd') as bd_esti_start_date, " +
	//"FORMAT(bd_start_date, 'yyyy-MM-dd') as bd_start_date, " +
	//"FORMAT(bd_esti_fin_date, 'yyyy-MM-dd') as bd_esti_fin_date, " +
	//"FORMAT(bd_fin_date, 'yyyy-MM-dd') as bd_fin_date, " +
	"convert(varchar(10), bd_esti_start_date, 120) as bd_esti_start_date, " +
	"convert(varchar(10), bd_start_date, 120) as bd_start_date, " +
	"convert(varchar(10), bd_esti_fin_date, 120) as bd_esti_fin_date, " +
	"convert(varchar(10), bd_fin_date, 120) as bd_fin_date, " +

	"bd_wt, bd_type, " +
	"dd_esti_mh, dd_esti_dwg, " +
	//"FORMAT(dd_esti_start_date, 'yyyy-MM-dd') as dd_esti_start_date, " +
	//"FORMAT(dd_start_date, 'yyyy-MM-dd') as dd_start_date, " +
	//"FORMAT(dd_esti_fin_date, 'yyyy-MM-dd') as dd_esti_fin_date, " +
	//"FORMAT(dd_fin_date, 'yyyy-MM-dd') as dd_fin_date, " +
	"convert(varchar(10), dd_esti_start_date, 120) as dd_esti_start_date, " +
	"convert(varchar(10), dd_start_date, 120) as dd_start_date, " +
	"convert(varchar(10), dd_esti_fin_date, 120) as dd_esti_fin_date, " +
	"convert(varchar(10), dd_fin_date, 120) as dd_fin_date, " +

	"dd_wt, dd_type, " +
	"cnt_esti_mh, cnt_esti_dwg, " +
	//"FORMAT(cnt_esti_start_date, 'yyyy-MM-dd') as cnt_esti_start_date, " +
	//"FORMAT(cnt_start_date, 'yyyy-MM-dd') as cnt_start_date, " +
	//"FORMAT(cnt_esti_fin_date, 'yyyy-MM-dd') as cnt_esti_fin_date, " +
	//"FORMAT(cnt_fin_date, 'yyyy-MM-dd') as cnt_fin_date, " +
	"convert(varchar(10), cnt_esti_start_date, 120) as cnt_esti_start_date, " +
	"convert(varchar(10), cnt_start_date, 120) as cnt_start_date, " +
	"convert(varchar(10), cnt_esti_fin_date, 120) as cnt_esti_fin_date, " +
	"convert(varchar(10), cnt_fin_date, 120) as cnt_fin_date, " +

	"cnt_wt, cnt_type, " +
	"dcs_esti_mh, dcs_esti_dwg, " +
	//"FORMAT(dcs_esti_start_date, 'yyyy-MM-dd') as dcs_esti_start_date, " +
	//"FORMAT(dcs_start_date, 'yyyy-MM-dd') as dcs_start_date, " +
	//"FORMAT(dcs_esti_fin_date, 'yyyy-MM-dd') as dcs_esti_fin_date, " +
	//"FORMAT(dcs_fin_date, 'yyyy-MM-dd') as dcs_fin_date, " +
	"convert(varchar(10), dcs_esti_start_date, 120) as dcs_esti_start_date, " +
	"convert(varchar(10), dcs_start_date, 120) as dcs_start_date, " +
	"convert(varchar(10), dcs_esti_fin_date, 120) as dcs_esti_fin_date, " +
	"convert(varchar(10), dcs_fin_date, 120) as dcs_fin_date, " +

	"dcs_wt, dcs_type, " +
	"plc_esti_mh, plc_esti_dwg, " +
	//"FORMAT(plc_esti_start_date, 'yyyy-MM-dd') as plc_esti_start_date, " +
	//"FORMAT(plc_start_date, 'yyyy-MM-dd') as plc_start_date, " +
	//"FORMAT(plc_esti_fin_date, 'yyyy-MM-dd') as plc_esti_fin_date, " +
	//"FORMAT(plc_fin_date, 'yyyy-MM-dd') as plc_fin_date, " +
	"convert(varchar(10), plc_esti_start_date, 120) as plc_esti_start_date, " +
	"convert(varchar(10), plc_start_date, 120) as plc_start_date, " +
	"convert(varchar(10), plc_esti_fin_date, 120) as plc_esti_fin_date, " +
	"convert(varchar(10), plc_fin_date, 120) as plc_fin_date, " +

	"plc_wt, plc_type, " +
	"buy_esti_mh, buy_esti_dwg, " +
	//"FORMAT(buy_esti_start_date, 'yyyy-MM-dd') as buy_esti_start_date, " +
	//"FORMAT(buy_start_date, 'yyyy-MM-dd') as buy_start_date, " +
	//"FORMAT(buy_esti_fin_date, 'yyyy-MM-dd') as buy_esti_fin_date, " +
	//"FORMAT(buy_fin_date, 'yyyy-MM-dd') as buy_fin_date, " +
	"convert(varchar(10), buy_esti_start_date, 120) as buy_esti_start_date, " +
	"convert(varchar(10), buy_start_date, 120) as buy_start_date, " +
	"convert(varchar(10), buy_esti_fin_date, 120) as buy_esti_fin_date, " +
	"convert(varchar(10), buy_fin_date, 120) as buy_fin_date, " +

	"buy_wt, buy_type, " +
	"con_esti_mh, " +
	//"FORMAT(con_esti_start_date, 'yyyy-MM-dd') as con_esti_start_date, " +
	//"FORMAT(con_start_date, 'yyyy-MM-dd') as con_start_date, " +
	//"FORMAT(con_esti_fin_date, 'yyyy-MM-dd') as con_esti_fin_date, " +
	//"FORMAT(con_fin_date, 'yyyy-MM-dd') as con_fin_date, " +
	"convert(varchar(10), con_esti_start_date, 120) as con_esti_start_date, " +
	"convert(varchar(10), con_start_date, 120) as con_start_date, " +
	"convert(varchar(10), con_esti_fin_date, 120) as con_esti_fin_date, " +
	"convert(varchar(10), con_fin_date, 120) as con_fin_date, " +

	"con_wt, con_type, " +
	"com_esti_mh, " +
	//"FORMAT(com_esti_start_date, 'yyyy-MM-dd') as com_esti_start_date, " +
	//"FORMAT(com_start_date, 'yyyy-MM-dd') as com_start_date, " +
	//"FORMAT(com_esti_fin_date, 'yyyy-MM-dd') as com_esti_fin_date, " +
	//"FORMAT(com_fin_date, 'yyyy-MM-dd') as com_fin_date, " +
	"convert(varchar(10), com_esti_start_date, 120) as com_esti_start_date, " +
	"convert(varchar(10), com_start_date, 120) as com_start_date, " +
	"convert(varchar(10), com_esti_fin_date, 120) as com_esti_fin_date, " +
	"convert(varchar(10), com_fin_date, 120) as com_fin_date, " +

	"com_wt, com_type, " +
	"rpt_esti_mh, rpt_esti_dwg, " +
	//"FORMAT(rpt_esti_start_date, 'yyyy-MM-dd') as com_esti_start_date, " +
	//"FORMAT(rpt_start_date, 'yyyy-MM-dd') as com_start_date, " +
	//"FORMAT(rpt_esti_fin_date, 'yyyy-MM-dd') as com_esti_fin_date, " +
	//"FORMAT(rpt_fin_date, 'yyyy-MM-dd') as com_fin_date, " +
	"convert(varchar(10), rpt_esti_start_date, 120) as com_esti_start_date, " +
	"convert(varchar(10), rpt_start_date, 120) as com_start_date, " +
	"convert(varchar(10), rpt_esti_fin_date, 120) as com_esti_fin_date, " +
	"convert(varchar(10), rpt_fin_date, 120) as com_fin_date, " +

	"rpt_wt, rpt_type, " +
	"estiprogresstext, estiprogresstexty6n " +
		"from estibyproject where " + condstr +
		"order by jobno, subjobno asc";

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
		await db.estibyproject.create(val, { transaction: t });
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
	console.log(val);
	let updateobj = {};
	for(const key in val) {
		if (['jobno', 'subjobno'].indexOf(key) === -1) {
			updateobj[key] = val[key];
		}
	}
	const t = await db.sequelize.transaction();
	try {
		await db.estibyproject.update(updateobj, {
			where: {
				jobno: val.jobno,
				subjobno: val.subjobno
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
		await db.estibyproject.destroy({
			where: {
				jobno: val.jobno,
				subjobno: val.subjobno,
				//yearmonth: val.yearmonth
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
		await db.estibyproject.destroy({
			where: {
				jobno: val.jobno
				//yearmonth: val.yearmonth
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
