const db = require('../models');

// 個人設計績效
// input format: { employeeno: 職工編號, yearmonth1: 開始年月, yearmonth2: 結束年月 }
async function getKPIByUser(req, res) {
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
		"select m.employeeno, e.name, b.jobname, mi.jobno, mi.subjobno, mi.yearmonth, mi.jobid, mi.lmn_mh, mi.lmn_dwg, mi.accu_mh, mi.accu_dwg, mi.esti_prg, mi.act_prg, " +
		"ei.design_type " +
		"from monthbyitem mi " +
		"inner join estibyitem ei on mi.jobno = ei.jobno and mi.subjobno = ei.subjobno and mi.jobid = ei.jobid " +
		"inner join member m on mi.jobno = m.jobno and mi.subjobno = m.subjobno " +
		"inner join employee e on m.employeeno = e.employeeno " +
		"inner join basic b on mi.jobno = b.jobno " +
		"where m.employeeno = $employeeno and mi.yearmonth >= $yearmonth1 and mi.yearmonth <= $yearmonth2 " +
		"order by mi.jobno, mi.yearmonth, mi.jobid asc";

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

// 進行中工程案
// input format: { ofgroup: 組別(ex: Y63%) }
async function getPrjinprogress(req, res) {
	//let eq;
	let queryobj = {};
	let condstr = "";
	for(const key in req.query) {
		let val = req.query[key];

		if (val.slice(-1) == '%') {
			//eq = 'like';
			queryobj[key] = '%' + val;
		} else if (val == '' || val == null) {
			//eq = 'like';
			queryobj[key] = '%';
		} else {
			//eq = '=';
			queryobj[key] = val;
		}
		//condstr = condstr + `${key} ${eq} $${key} and `;
	}
	//condstr = condstr.slice(0, -4); //slice " and ".len()

	let querystr =
		"select a.jobno, a.jobname, a.jobtype, a.designtype, a.appdept, a.status " +
		"from (select b.*, l.employeeno, l.enddate, e.name, e.ofgroup1 " +
		"from basic b inner join leader l on b.jobno = l.jobno " +
		"inner join employee e on l.employeeno = e.employeeno " +
		"where e.ofgroup1 like $ofgroup and b.status <> '暫時中止' and b.status <> '結案' and l.enddate is null) " +
		"as a " +
		"group by a.jobno, a.jobname, a.jobtype, a.designtype, a.appdept, a.status " +
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
		res.status(404).send('error');
	}
};

// 個人歷年工程案
// input foramt: { employeeno: 職工編號() }
async function getPersonalJobs(req, res) {
	//let eq;
	let queryobj = {};
	for(const key in req.query) {
		queryobj[key] = req.query[key];
	}
	let querystr =
		"select b.jobno, b.jobname, b.appdept, b.approvalno, b.joborderno, b.jobtype, b.budgetyearst, b.budgetyearsp, " +
		"replace(convert(nvarchar, cast(b.totalbudget as money), 1), '.00', '') as totalbudget, " +
		"replace(convert(nvarchar, cast(b.electricalbudget as money), 1), '.00', '') as electricalbudget " +
		"from basic b " +
		"inner join member m on b.jobno = m.jobno " +
		"where m.employeeno = $employeeno " +
		"order by b.budgetyearst, b.jobno asc";

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

// 計畫請購金額 => sum of orders.estimateamount
async function getEstimateamount(req, res) {

	let queryobj = {};
	for(const key in req.query) {
		queryobj[key] = req.query[key];
	}
	let jobno = queryobj['jobno'];
	let subjobno = queryobj['subjobno'];

	let querystr = '';
	if (subjobno != 'all') {
		querystr =
			"SELECT b.jobno, b.subjobno, Sum(b.estimateamount) AS estimateamount " +
			"FROM basic a INNER JOIN orders b On (a.jobno = b.jobno) " +
			"GROUP BY b.jobno, b.subjobno " +
			"HAVING b.jobno = $jobno and b.subjobno = $subjobno";
	} else {
		querystr =
			"SELECT b.jobno, Sum(b.estimateamount) AS estimateamount " +
			"FROM basic a INNER JOIN orders b On (a.jobno = b.jobno) " +
			"GROUP BY b.jobno " +
			"HAVING b.jobno = $jobno";
	}
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

// 應請購金額
async function getPurchaseEsti(req, res) {

	let queryobj = {};
	for(const key in req.query) {
		queryobj[key] = req.query[key];
	}
	let jobno = queryobj['jobno'];
	let subjobno = queryobj['subjobno'];
	let date_st = queryobj['date_st'];
	let date_sp = queryobj['date_sp'];

	let querystr = '';
	if (subjobno != 'all') {
		querystr =
			"SELECT b.jobno, b.subjobno, " +
			"Round(Sum(c.quantity * c.esti_unit_price * c.estiexchangerate), 0) AS estiamount, " +
			"Round(Sum(c.quantity * c.unit_price * c.exchangerate), 0) AS amount " +
			"FROM (Orders b INNER JOIN OrderItems c ON (b.item = c.serialno) AND (b.subjobno = c.subjobno) AND (b.jobno = c.jobno)) INNER JOIN basic a ON b.jobno = a.jobno " +
			"WHERE b.Purchase_esti_issue_date > $date_st and b.Purchase_esti_issue_date <= $date_sp " +
			"GROUP BY b.jobno, b.subjobno " +
			"HAVING b.jobno = $jobno and b.subjobno = $subjobno";
	} else {
		querystr =
			"SELECT b.jobno, " +
			"Round(Sum(c.quantity * c.esti_unit_price * c.estiexchangerate), 0) AS estiamount, " +
			"Round(Sum(c.quantity * c.unit_price * c.exchangerate), 0) AS amount " +
			"FROM (Orders b INNER JOIN OrderItems c ON (b.item = c.serialno) AND (b.subjobno = c.subjobno) AND (b.jobno = c.jobno)) INNER JOIN basic a ON b.jobno = a.jobno " +
			"WHERE b.Purchase_esti_issue_date > $date_st and b.Purchase_esti_issue_date <= $date_sp " +
			"GROUP BY b.jobno " +
			"HAVING b.jobno = $jobno";
	}

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

// 已請購金額
async function getPurchase(req, res) {
	let queryobj = {};
	for(const key in req.query) {
		queryobj[key] = req.query[key];
	}

	let jobno = queryobj['jobno'];
	let subjobno = queryobj['subjobno'];
	let date_st = queryobj['date_st'];
	let date_sp = queryobj['date_sp'];
	let querystr = '';
	if (subjobno != 'all') {
		querystr =
			"SELECT b.jobno, b.subjobno, " +
			"Round(Sum(c.quantity * c.esti_unit_price * c.estiexchangerate), 0) AS estiamount, " +
			"Round(Sum(c.quantity * c.unit_price * c.exchangerate), 0) AS amount " +
			"FROM (Orders b INNER JOIN OrderItems c ON (b.item = c.serialno) AND (b.subjobno = c.subjobno) AND (b.jobno = c.jobno)) INNER JOIN basic a ON b.jobno = a.jobno " +
			"WHERE b.Purchase_issue_date > $date_st and b.Purchase_issue_date <= $date_sp " +
			"GROUP BY b.jobno, b.subjobno " +
			"HAVING b.jobno = $jobno and b.subjobno = $subjobno";

	} else {
		querystr =
			"SELECT b.jobno, " +
			"Round(Sum(c.quantity * c.esti_unit_price * c.estiexchangerate), 0) AS estiamount, " +
			"Round(Sum(c.quantity * c.unit_price * c.exchangerate), 0) AS amount " +
			"FROM (Orders b INNER JOIN OrderItems c ON (b.item = c.serialno) AND (b.subjobno = c.subjobno) AND (b.jobno = c.jobno)) INNER JOIN basic a ON b.jobno = a.jobno " +
			"WHERE b.Purchase_issue_date > $date_st and b.Purchase_issue_date <= $date_sp " +
			"GROUP BY b.jobno " +
			"HAVING b.jobno = $jobno";
	}

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

// 應訂購金額
async function getOrderEsti(req, res) {
	let queryobj = {};
	for(const key in req.query) {
		queryobj[key] = req.query[key];
	}

	let jobno = queryobj['jobno'];
	let subjobno = queryobj['subjobno'];
	let date_st = queryobj['date_st'];
	let date_sp = queryobj['date_sp'];
	let querystr = '';
	if (subjobno != 'all') {
		querystr =
			"SELECT b.jobno, b.subjobno, " +
			"Round(Sum(c.quantity * c.esti_unit_price * c.estiexchangerate), 0) AS estiamount, " +
			"Round(Sum(c.quantity * c.unit_price * c.exchangerate), 0) AS amount " +
			"FROM (Orders b INNER JOIN OrderItems c ON (b.item = c.serialno) AND (b.subjobno = c.subjobno) AND (b.jobno = c.jobno)) INNER JOIN basic a ON b.jobno = a.jobno " +
			"WHERE b.c1_order_esti_date > $date_st and b.c1_order_esti_date <= $date_sp " +
			"GROUP BY b.jobno, b.subjobno " +
			"HAVING b.jobno = $jobno and b.subjobno = $subjobno";

	} else {
		querystr =
			"SELECT b.jobno, " +
			"Round(Sum(c.quantity * c.esti_unit_price * c.estiexchangerate), 0) AS estiamount, " +
			"Round(Sum(c.quantity * c.unit_price * c.exchangerate), 0) AS amount " +
			"FROM (Orders b INNER JOIN OrderItems c ON (b.item = c.serialno) AND (b.subjobno = c.subjobno) AND (b.jobno = c.jobno)) INNER JOIN basic a ON b.jobno = a.jobno " +
			"WHERE b.c1_order_esti_date > $date_st and b.c1_order_esti_date <= $date_sp " +
			"GROUP BY b.jobno " +
			"HAVING b.jobno = $jobno";
	}

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

// 已訂購金額
async function getOrder(req, res) {
	let queryobj = {};
	for(const key in req.query) {
		queryobj[key] = req.query[key];
	}

	let jobno = queryobj['jobno'];
	let subjobno = queryobj['subjobno'];
	let date_st = queryobj['date_st'];
	let date_sp = queryobj['date_sp'];
	let querystr = '';
	if (subjobno != 'all') {
		querystr =
			"SELECT b.jobno, b.subjobno, " +
			"Round(Sum(c.quantity * c.esti_unit_price * c.estiexchangerate), 0) AS estiamount, " +
			"Round(Sum(c.quantity * c.unit_price * c.exchangerate), 0) AS amount " +
			"FROM (Orders b INNER JOIN OrderItems c ON (b.item = c.serialno) AND (b.subjobno = c.subjobno) AND (b.jobno = c.jobno)) INNER JOIN basic a ON b.jobno = a.jobno " +
			"WHERE b.c1_order_date > $date_st and b.c1_order_date <= $date_sp " +
			"GROUP BY b.jobno, b.subjobno " +
			"HAVING b.jobno = $jobno and b.subjobno = $subjobno";

	} else {
		querystr =
			"SELECT b.jobno, " +
			"Round(Sum(c.quantity * c.esti_unit_price * c.estiexchangerate), 0) AS estiamount, " +
			"Round(Sum(c.quantity * c.unit_price * c.exchangerate), 0) AS amount " +
			"FROM (Orders b INNER JOIN OrderItems c ON (b.item = c.serialno) AND (b.subjobno = c.subjobno) AND (b.jobno = c.jobno)) INNER JOIN basic a ON b.jobno = a.jobno " +
			"WHERE b.c1_order_date > $date_st and b.c1_order_date <= $date_sp " +
			"GROUP BY b.jobno " +
			"HAVING b.jobno = $jobno";
	}

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

// 應交貨金額
async function getDeliveryEsti(req, res) {
	let queryobj = {};
	for(const key in req.query) {
		queryobj[key] = req.query[key];
	}

	let jobno = queryobj['jobno'];
	let subjobno = queryobj['subjobno'];
	let date_st = queryobj['date_st'];
	let date_sp = queryobj['date_sp'];
	let querystr = '';
	if (subjobno != 'all') {
		querystr =
			"SELECT b.jobno, b.subjobno, " +
			"Round(Sum(c.quantity * c.esti_unit_price * c.estiexchangerate), 0) AS estiamount, " +
			"Round(Sum(c.quantity * c.unit_price * c.exchangerate), 0) AS amount " +
			"FROM (Orders b INNER JOIN OrderItems c ON (b.item = c.serialno) AND (b.subjobno = c.subjobno) AND (b.jobno = c.jobno)) INNER JOIN basic a ON b.jobno = a.jobno " +
			"WHERE c.delivery_esti_date > $date_st and c.delivery_esti_date <= $date_sp " +
			"GROUP BY b.jobno, b.subjobno "+
			"HAVING b.jobno = $jobno and b.subjobno = $subjobno";

	} else {
		querystr =
			"SELECT b.jobno, " +
			"Round(Sum(c.quantity * c.esti_unit_price * c.estiexchangerate), 0) AS estiamount, " +
			"Round(Sum(c.quantity * c.unit_price * c.exchangerate), 0) AS amount " +
			"FROM (Orders b INNER JOIN OrderItems c ON (b.item = c.serialno) AND (b.subjobno = c.subjobno) AND (b.jobno = c.jobno)) INNER JOIN basic a ON b.jobno = a.jobno " +
			"WHERE c.delivery_esti_date > $date_st and c.delivery_esti_date <= $date_sp " +
			"GROUP BY b.jobno " +
			"HAVING b.jobno = $jobno";
	}

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

// 已交貨金額
async function getDelivery(req, res) {
	let queryobj = {};
	for(const key in req.query) {
		queryobj[key] = req.query[key];
	}

	let jobno = queryobj['jobno'];
	let subjobno = queryobj['subjobno'];
	let date_st = queryobj['date_st'];
	let date_sp = queryobj['date_sp'];
	let querystr = '';
	if (subjobno != 'all') {
		querystr =
			"SELECT b.jobno, b.subjobno, " +
			"Round(Sum(c.quantity * c.esti_unit_price * c.estiexchangerate), 0) AS estiamount, " +
			"Round(Sum(c.quantity * c.unit_price * c.exchangerate), 0) AS amount " +
			"FROM (Orders b INNER JOIN OrderItems c ON (b.item = c.serialno) AND (b.subjobno = c.subjobno) AND (b.jobno = c.jobno)) INNER JOIN basic a ON b.jobno = a.jobno " +
			"WHERE c.delivery_esti_date > $date_st and c.delivery_date > $date_st and c.delivery_date <= $date_sp " +
			"GROUP BY b.jobno, b.subjobno " +
			"HAVING b.jobno = $jobno and b.subjobno = $subjobno";
	} else {
		querystr =
			"SELECT b.jobno, " +
			"Round(Sum(c.quantity * c.esti_unit_price * c.estiexchangerate), 0) AS estiamount, " +
			"Round(Sum(c.quantity * c.unit_price * c.exchangerate), 0) AS amount " +
			"FROM (Orders b INNER JOIN OrderItems c ON (b.item = c.serialno) AND (b.subjobno = c.subjobno) AND (b.jobno = c.jobno)) INNER JOIN basic a ON b.jobno = a.jobno " +
			"WHERE c.delivery_esti_date > $date_st and c.delivery_date > $date_st and c.delivery_date <= $date_sp " +
			"GROUP BY b.jobno " +
			"HAVING b.jobno = $jobno";
	}
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

// 應驗收金額
async function getReceiveCheckEsti(req, res) {
	let queryobj = {};
	for(const key in req.query) {
		queryobj[key] = req.query[key];
	}

	let jobno = queryobj['jobno'];
	let subjobno = queryobj['subjobno'];
	let date_st = queryobj['date_st'];
	let date_sp = queryobj['date_sp'];
	let querystr = '';
	if (subjobno != 'all') {
		querystr =
			"SELECT b.jobno, b.subjobno, " +
			"Round(Sum(c.quantity * c.esti_unit_price * c.estiexchangerate), 0) AS estiamount, " +
			"Round(Sum(c.quantity * c.unit_price * c.exchangerate), 0) AS amount " +
			"FROM (Orders b INNER JOIN OrderItems c ON (b.item = c.serialno) AND (b.subjobno = c.subjobno) AND (b.jobno = c.jobno)) INNER JOIN basic a ON b.jobno = a.jobno " +
			"WHERE c.receivecheck_esti_date > $date_st and c.receivecheck_esti_date <= $date_sp " +
			"GROUP BY b.jobno, b.subjobno " +
			"HAVING b.jobno = $jobno and b.subjobno = $subjobno";
	} else {
		querystr =
			"SELECT b.jobno, " +
			"Round(Sum(c.quantity * c.esti_unit_price * c.estiexchangerate), 0) AS estiamount, " +
			"Round(Sum(c.quantity * c.unit_price * c.exchangerate), 0) AS amount " +
			"FROM (Orders b INNER JOIN OrderItems c ON (b.item = c.serialno) AND (b.subjobno = c.subjobno) AND (b.jobno = c.jobno)) INNER JOIN basic a ON b.jobno = a.jobno " +
			"WHERE c.receivecheck_esti_date > $date_st and c.receivecheck_esti_date <= $date_sp " +
			"GROUP BY b.jobno " +
			"HAVING b.jobno = $jobno";
	}
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

// 已驗收金額
async function getReceiveCheck(req, res) {
	let queryobj = {};
	for(const key in req.query) {
		queryobj[key] = req.query[key];
	}

	let jobno = queryobj['jobno'];
	let subjobno = queryobj['subjobno'];
	let date_st = queryobj['date_st'];
	let date_sp = queryobj['date_sp'];
	let querystr = '';
	if (subjobno != 'all') {
		querystr =
			"SELECT b.jobno, b.subjobno, " +
			"Round(Sum(c.quantity * c.esti_unit_price * c.estiexchangerate * c.ReceiveCheckRatio / 100), 0) AS estiamount, " +
			"Round(Sum(c.quantity * c.unit_price * c.exchangerate * c.ReceiveCheckRatio / 100), 0) AS amount " +
			"FROM (Orders b INNER JOIN OrderItems c ON (b.item = c.serialno) AND (b.subjobno = c.subjobno) AND (b.jobno = c.jobno)) INNER JOIN basic a ON b.jobno = a.jobno " +
			"WHERE c.receivecheck_esti_date > $date_st and c.receivecheck_date > $date_st and c.receivecheck_date <= $date_sp " +
			"GROUP BY b.jobno,b.subjobno " +
			"HAVING b.jobno = $jobno and b.subjobno = $subjobno";
	} else {
		querystr =
			"SELECT b.jobno, " +
			"Round(Sum(c.quantity * c.esti_unit_price * c.estiexchangerate * c.ReceiveCheckRatio / 100), 0) AS estiamount, " +
			"Round(Sum(c.quantity * c.unit_price * c.exchangerate * c.ReceiveCheckRatio / 100), 0) AS amount " +
			"FROM (Orders b INNER JOIN OrderItems c ON (b.item = c.serialno) AND (b.subjobno = c.subjobno) AND (b.jobno = c.jobno)) INNER JOIN basic a ON b.jobno = a.jobno " +
			"WHERE c.receivecheck_esti_date > $date_st and c.receivecheck_date > $date_st and c.receivecheck_date <= $date_sp " +
			"GROUP BY b.jobno " +
			"HAVING b.jobno = $jobno";
	}

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



// 各組加班統計
// input format: { date_st: 開始日期, yearmonth2: 結束日期 }
async function getOTSumByTeam(req, res) {
	let queryobj = {};
	for(const key in req.query) {
		queryobj[key] = req.query[key];
	}
	queryobj['teamno'] = queryobj['teamno'] + '%';
	let querystr =
		"select teamno, sum(compensation) as compensation, sum(overtime) as overtime, sum(ot_total) as ot_total " +
		"from overtime " +
		"where teamno like $teamno and date_st >= $date_st and date_sp <= $date_sp " +
		"group by teamno";

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

// 個人加班統計
// input format: { teamno: 組別, date_st: 開始日期, yearmonth2: 結束日期 }
async function getOTSumByUser(req, res) {
	let queryobj = {};
	for(const key in req.query) {
		queryobj[key] = req.query[key];
	}
	queryobj['teamno'] = queryobj['teamno'] + '%';
	let querystr =
		"select o.teamno, o.employeeno, e.name, sum(o.compensation) as compensation, sum(o.overtime) as overtime, sum(o.ot_total) as ot_total " +
		"from overtime o left join employee e on o.employeeno = e.employeeno " +
		"where o.teamno like $teamno and o.date_st >= $date_st and o.date_sp <= $date_sp " +
		"group by o.teamno, o.employeeno, e.name " +
		"order by o.teamno, o.employeeno desc"


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

// 個人加班清單
// input format: { employeeno: 職工編號, date_st: 開始日期, yearmonth2: 結束日期 }
async function getOTListByUser(req, res) {
	let queryobj = {};
	for(const key in req.query) {
		queryobj[key] = req.query[key];
	}
	let querystr =
		"select o.teamno, o.employeeno, e.name, " +
		"convert(varchar(10), o.date_st, 120) as date_st, " +
		"convert(varchar(10), o.date_sp, 120) as date_sp, " +
		"o.compensation, o.overtime, o.ot_total, o.reason " +
		"from overtime o left join employee e on o.employeeno = e.employeeno " +
		"where o.employeeno = $employeeno and o.date_st >= $date_st and o.date_sp <= $date_sp " +
		"order by o.teamno, o.date_st desc"

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

// 加班清單 / ALL
// input format: { date_st: 開始日期, yearmonth2: 結束日期 }
async function getOTList(req, res) {
	let queryobj = {};
	for(const key in req.query) {
		queryobj[key] = req.query[key];
	}
	let querystr =
		"select o.teamno, o.employeeno, e.name, " +
		"convert(varchar(10), o.date_st, 120) as date_st, " +
		"convert(varchar(10), o.date_sp, 120) as date_sp, " +
		"o.compensation, o.overtime, o.ot_total, o.reason " +
		"from overtime o left join employee e on o.employeeno = e.employeeno " +
		"where o.date_st >= $date_st and o.date_sp <= $date_sp " +
		"order by o.teamno, o.date_st desc"

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


module.exports = {
	getKPIByUser,
	getPrjinprogress,
	getPersonalJobs,
	getEstimateamount,
	getPurchaseEsti,
	getPurchase,
	getOrderEsti,
	getOrder,
	getDeliveryEsti,
	getDelivery,
	getReceiveCheckEsti,
	getReceiveCheck,
	getOTSumByTeam,
	getOTSumByUser,
	getOTListByUser,
	getOTList,
};
