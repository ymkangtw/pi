//const { sequelize } = require('../models');
const db = require('../models');
//const Op = db.Op;

async function getAll(req, res) {
	let querystr = 
		"select jobno, projectno, jobname, appdept, approvalno, "+
		"designtype, totalbudget, electricalbudget, budgetyearst, budgetyearsp, " +
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
		condstr = condstr + `e.${key} ${eq} $${key} and `;
	}
	condstr = condstr.slice(0, -4);
	let querystr = 
		"select a.jobno, a.jobname, a.jobtype, a.designtype, a.status, a.electricalbudget " +
		"from (select b.*, l.employeeno, l.enddate, e.name, e.ofgroup1 " + 
		"from basic b inner join leader l on b.jobno = l.jobno " +
		"inner join employee e on l.employeeno = e.employeeno " +
		"where " + condstr + " and b.status <> '暫時中止' and b.status <> '結案' and l.enddate is null) " +
		"as a " +
		"group by a.jobno, a.jobname, a.jobtype, a.designtype, a.status, a.electricalbudget " +
		"order by a.jobname, a.jobno asc";

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

async function getByTeam(req, res) {
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
		condstr = condstr + `e.${key} ${eq} $${key} and `;
	}
	condstr = condstr.slice(0, -4);
	let querystr = 
		"select a.jobno, a.jobname, a.jobtype, a.designtype, a.status, a.electricalbudget " +
		"from (select b.*, l.employeeno, l.enddate, e.name, e.ofgroup1 " + 
		"from basic b inner join leader l on b.jobno = l.jobno " +
		"inner join employee e on l.employeeno = e.employeeno " +
		"where " + condstr + " and b.status <> '暫時中止' and b.status <> '結案' and l.enddate is null) " +
		"as a  " +
		"group by a.jobno, a.jobname, a.jobtype, a.designtype, a.status, a.electricalbudget " +
		"order by a.jobname, a.jobno asc";

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

async function getByAllTeamMember(req, res) {
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
		condstr = condstr + `e.${key} ${eq} $${key} and `;
	}
	condstr = condstr.slice(0, -4);
/*
	let querystr = 
		"select a.jobno, a.subjobno, a.jobname, a.employeeno, a.name, a.jobtype, a.designtype, a.status " +
		"from (select b.*, m.subjobno, m.employeeno, m.enddate, e.name, e.ofgroup1 " + 
		"from basic b inner join member m on b.jobno = m.jobno " +
		"inner join employee e on m.employeeno = e.employeeno " +
		"where " + condstr + " and b.status <> '暫時中止' and b.status <> '結案' and m.enddate is null) " +
		"as a  " +
		//"group by a.jobno, a.jobname, a.jobtype, a.designtype, a.status " +
		"order by a.jobname, a.jobno asc";
*/
	//工程最近輸入日期及進度
	let querystr = 
		"select a.jobno, a.subjobno, a.jobname, a.employeeno, a.name, a.jobtype, a.designtype, a.status, a.electricalbudget, a.yearmonth, a.prg_esti, a.prg_act " +
		"from (select b.*, m.subjobno, m.employeeno, m.enddate, e.name, e.ofgroup1, mp1.yearmonth, mp1.prg_esti, mp1.prg as prg_act " + 
		"from basic b inner join member m on b.jobno = m.jobno " +
		"inner join employee e on m.employeeno = e.employeeno " +
		"inner join monthbyproject mp1 on mp1.jobno = m.jobno and mp1.subjobno = m.subjobno " +
		"where " + condstr + " and b.status <> '暫時中止' and b.status <> '結案' and m.enddate is null " +
		"and mp1.yearmonth = (select max(yearmonth) from monthbyproject mp2 where mp1.jobno = mp2.jobno and mp1.subjobno = mp2.subjobno)" +
		") as a " +
		"group by a.jobno, a.subjobno, a.jobname, a.employeeno, a.name, a.jobtype, a.designtype, a.status, a.electricalbudget, a.yearmonth, a.prg_esti, a.prg_act " +
		"order by a.jobname, a.jobno, a.subjobno asc";

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


async function getByLeader(req, res) {
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
		condstr = condstr + `e.${key} ${eq} $${key} and `;
	}
	condstr = condstr.slice(0, -4);
	let querystr = 
		"select a.jobno, a.jobname, a.jobtype, a.designtype, a.status, a.electricalbudget " +
		"from (select b.*, l.employeeno, l.enddate, e.name, e.ofgroup1 " + 
		"from basic b inner join leader l on b.jobno = l.jobno " +
		"inner join employee e on l.employeeno = e.employeeno " +
		"where " + condstr + " and b.status <> '暫時中止' and b.status <> '結案' and l.enddate is null) " +
		"as a " +
		"group by a.jobno, a.jobname, a.jobtype, a.designtype, a.status, a.electricalbudget " +
		"order by a.jobname, a.jobno asc";

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

async function getByMember(req, res) {
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
		condstr = condstr + `e.${key} ${eq} $${key} and `;
	}
	condstr = condstr.slice(0, -4);

	let querystr = 
		"select a.jobno, a.jobname, a.jobtype, a.designtype, a.status, a.electricalbudget " +
		"from (select b.*, m.employeeno, m.enddate, e.name, e.ofgroup1 " + 
		"from basic b inner join member m on b.jobno = m.jobno " +
		"inner join employee e on m.employeeno = e.employeeno " +
		"where " + condstr + " and b.status <> '暫時中止' and b.status <> '結案' and m.enddate is null) " +
		"as a " +
		"group by a.jobno, a.jobname, a.jobtype, a.designtype, a.status, a.electricalbudget " +
		"order by a.jobname, a.jobno asc";

/*
	//工程最近輸入日期及進度
	let querystr = 
		"select a.jobno, a.subjobno, a.jobname, a.employeeno, a.name, a.jobtype, a.designtype, a.status, a.yearmonth, a.prg_esti, a.prg_act " +
		"from (select b.*, m.subjobno, m.employeeno, m.enddate, e.name, e.ofgroup1, mp1.yearmonth, mp1.prg_esti, mp1.prg as prg_act " + 
		"from basic b inner join member m on b.jobno = m.jobno " +
		"inner join employee e on m.employeeno = e.employeeno " +
		"inner join monthbyproject mp1 on mp1.jobno = m.jobno and mp1.subjobno = m.subjobno " +
		"where " + condstr + " and b.status <> '暫時中止' and b.status <> '結案' and m.enddate is null " +
		"and mp1.yearmonth = (select max(yearmonth) from monthbyproject mp2 where mp1.jobno = mp2.jobno and mp1.subjobno = mp2.subjobno)" +
		") as a " +
		"group by a.jobno, a.subjobno, a.jobname, a.employeeno, a.name, a.jobtype, a.designtype, a.status, a.yearmonth, a.prg_esti, a.prg_act " +
		"order by a.jobname, a.jobno, a.subjobno asc";
*/
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

async function getByIdreport(req, res) {
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
	condstr = condstr.slice(0, -4);
	let querystr = 
		"select jobno, jobname, jobtype, idealreportno, finalreportno, esti_start_date " + 
		"from basic " +
		"where " + condstr +
		"order by idealreportno desc";

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

async function getByFnreport(req, res) {
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
	condstr = condstr.slice(0, -4);
	let querystr = 
		"select jobno, jobname, jobtype, idealreportno, finalreportno, esti_start_date " + 
		"from basic " +
		"where " + condstr +
		"order by finalreportno desc";

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

module.exports = {
	getAll,
	getBy,
	getByTeam,
	getByLeader,
	getByMember,
	getByAllTeamMember,
	getByIdreport,
	getByFnreport,
};
