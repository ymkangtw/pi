//const { sequelize } = require('../models');
const db = require('../models');

async function getAll(req, res) {
	let querystr = 
		"select jobno, subjobno, item, orderno, " +
		//"FORMAT(purchase_esti_issue_date, 'yyyy-MM-dd') as purchase_esti_issue_date, " +
		//"FORMAT(purchase_issue_date, 'yyyy-MM-dd') as purchase_issue_date, " +
		//"FORMAT(c1_issue_date, 'yyyy-MM-dd') as c1_issue_date, " +
		//"FORMAT(c1_query_date, 'yyyy-MM-dd') as c1_query_date, " +
		//"FORMAT(c1_order_esti_date, 'yyyy-MM-dd') as c1_order_esti_date, " +
		//"FORMAT(c1_order_date, 'yyyy-MM-dd') as c1_order_date, " +
		//"FORMAT(delivery_esti_date, 'yyyy-MM-dd') as delivery_esti_date, " +
		//"FORMAT(delivery_date, 'yyyy-MM-dd') as delivery_date, " +
		//"FORMAT(receivecheck_esti_date, 'yyyy-MM-dd') as receivecheck_esti_date, " +
		//"FORMAT(receivecheck_date, 'yyyy-MM-dd') as receivecheck_date, " +
		"convert(varchar(10), purchase_esti_issue_date, 120) as purchase_esti_issue_date, " +
		"convert(varchar(10), purchase_issue_date, 120) as purchase_issue_date, " +
		"convert(varchar(10), c1_issue_date, 120) as c1_issue_date, " +
		"convert(varchar(10), c1_query_date, 120) as c1_query_date, " +
		"convert(varchar(10), c1_order_esti_date, 120) as c1_order_esti_date, " +
		"convert(varchar(10), c1_order_date, 120) as c1_order_date, " +
		"convert(varchar(10), delivery_esti_date, 120) as delivery_esti_date, " +
		"convert(varchar(10), delivery_date, 120) as delivery_date, " +
		"convert(varchar(10), receivecheck_esti_date, 120) as receivecheck_esti_date, " +
		"convert(varchar(10), receivecheck_date, 120) as receivecheck_date, " +

		"c1_member, y6tserialno, content, category, jobid, note, isturnkey, budgetno, " +
		//"FORMAT(estimateamount, 'N0') as estimateamount, amount, formalorderno, currency, jobcommandno, " +
		//"replace(convert(nvarchar, cast(estimateamount as money), 1), '.00', '') as estimateamount, amount, formalorderno, currency, jobcommandno, " +
		"replace(convert(nvarchar, cast(estimateamount as money), 1), '.00', '') as estimateamount, " +
		"replace(convert(nvarchar, cast(amount as money), 1), '.00', '') as amount, " +
		"formalorderno, currency, jobcommandno, supplier_id, supplier_name, autoupdate, latedelivery2y61 " +
		
		"from orders " + 
		"order by jobno, subjobno, item asc";

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
		"select jobno, subjobno, item, orderno, " +
		//"FORMAT(purchase_esti_issue_date, 'yyyy-MM-dd') as purchase_esti_issue_date, " +
		//"FORMAT(purchase_issue_date, 'yyyy-MM-dd') as purchase_issue_date, " +
		//"FORMAT(c1_issue_date, 'yyyy-MM-dd') as c1_issue_date, " +
		//"FORMAT(c1_query_date, 'yyyy-MM-dd') as c1_query_date, " +
		//"FORMAT(c1_order_esti_date, 'yyyy-MM-dd') as c1_order_esti_date, " +
		//"FORMAT(c1_order_date, 'yyyy-MM-dd') as c1_order_date, " +
		//"FORMAT(delivery_esti_date, 'yyyy-MM-dd') as delivery_esti_date, " +
		//"FORMAT(delivery_date, 'yyyy-MM-dd') as delivery_date, " +
		//"FORMAT(receivecheck_esti_date, 'yyyy-MM-dd') as receivecheck_esti_date, " +
		//"FORMAT(receivecheck_date, 'yyyy-MM-dd') as receivecheck_date, " +
		"convert(varchar(10), purchase_esti_issue_date, 120) as purchase_esti_issue_date, " +
		"convert(varchar(10), purchase_issue_date, 120) as purchase_issue_date, " +
		"convert(varchar(10), c1_issue_date, 120) as c1_issue_date, " +
		"convert(varchar(10), c1_query_date, 120) as c1_query_date, " +
		"convert(varchar(10), c1_order_esti_date, 120) as c1_order_esti_date, " +
		"convert(varchar(10), c1_order_date, 120) as c1_order_date, " +
		"convert(varchar(10), delivery_esti_date, 120) as delivery_esti_date, " +
		"convert(varchar(10), delivery_date, 120) as delivery_date, " +
		"convert(varchar(10), receivecheck_esti_date, 120) as receivecheck_esti_date, " +
		"convert(varchar(10), receivecheck_date, 120) as receivecheck_date, " +

		"c1_member, y6tserialno, content, category, jobid, note, isturnkey, budgetno, " +
		//"FORMAT(estimateamount, 'N0') as estimateamount, amount, formalorderno, currency, jobcommandno, " +
		//"replace(convert(nvarchar, cast(estimateamount as money), 1), '.00', '') as estimateamount, amount, formalorderno, currency, jobcommandno, " +
		"replace(convert(nvarchar, cast(estimateamount as money), 1), '.00', '') as estimateamount, " +
		"replace(convert(nvarchar, cast(amount as money), 1), '.00', '') as amount, " +
		"formalorderno, currency, jobcommandno, supplier_id, supplier_name, autoupdate, latedelivery2y61 " +

		"from orders " + 
		"where " + condstr +
		"order by jobno, subjobno, item asc";	

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
		await db.orders.create(val, { transaction: t });
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
		if (['jobno', 'subjobno', 'item'].indexOf(key) === -1) {
			updateobj[key] = val[key];
		}
	}
	const t = await db.sequelize.transaction();
	try {
		await db.orders.update(updateobj, {
			where: {
				jobno: val.jobno,
				subjobno: val.subjobno,
				item: val.item
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
		await db.orders.destroy({
			where: {
				jobno: val.jobno,
				subjobno: val.subjobno,
				item: val.item
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
		await db.orders.destroy({
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
