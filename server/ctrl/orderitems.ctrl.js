//const { sequelize } = require('../models');
const db = require('../models');

async function getAll(req, res) {
	let querystr = 
		"select jobno, subjobno, serialno, orderno, item, " +
		"name, materialcode, quality, main_specification, specification_code, " +
		//"FORMAT(unit_price, 'N0') as unit_price , unit, quantity, supplierid, FORMAT(esti_unit_price, 'N0') as esti_unit_price, specification_path, " +
		//"FORMAT(receivecheck_esti_date, 'yyyy-MM-dd') as receivecheck_esti_date, " +
		//"FORMAT(receivecheck_date, 'yyyy-MM-dd') as receivecheck_date, " +
		//"FORMAT(delivery_esti_date, 'yyyy-MM-dd') as delivery_esti_date, " +
		//"FORMAT(delivery_date, 'yyyy-MM-dd') as delivery_date, " +
		"replace(convert(nvarchar, cast(unit_price as money), 1), '.00', '') as unit_price , unit, quantity, supplierid, " +
		"replace(convert(nvarchar, cast(esti_unit_price as money), 1), '.00', '') as esti_unit_price, specification_path, " +
		"convert(varchar(10), receivecheck_esti_date, 120) as receivecheck_esti_date, " +
		"convert(varchar(10), receivecheck_date, 120) as receivecheck_date, " +
		"convert(varchar(10), delivery_esti_date, 120) as delivery_esti_date, " +
		"convert(varchar(10), delivery_date, 120) as delivery_date, " +

		"currency, exchangerate, category, estiexchangerate, " +
		"receivecheckratio, checkquantity, name_q, wage " +
		"from orderitems " + 
		"order by jobno, subjobno, serialno, item asc";

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
		"select jobno, subjobno, serialno, orderno, item, " +
		"name, materialcode, quality, main_specification, specification_code, " +
		//"FORMAT(unit_price, 'N0') as unit_price, unit, quantity, supplierid, FORMAT(esti_unit_price, 'N0') as esti_unit_price, specification_path, " +
		//"FORMAT(receivecheck_esti_date, 'yyyy-MM-dd') as receivecheck_esti_date, " +
		//"FORMAT(receivecheck_date, 'yyyy-MM-dd') as receivecheck_date, " +
		//"FORMAT(delivery_esti_date, 'yyyy-MM-dd') as delivery_esti_date, " +
		//"FORMAT(delivery_date, 'yyyy-MM-dd') as delivery_date, " +
		"replace(convert(nvarchar, cast(unit_price as money), 1), '.00', '') as unit_price , unit, quantity, supplierid, " +
		"replace(convert(nvarchar, cast(esti_unit_price as money), 1), '.00', '') as esti_unit_price, specification_path, " +
		"convert(varchar(10), receivecheck_esti_date, 120) as receivecheck_esti_date, " +
		"convert(varchar(10), receivecheck_date, 120) as receivecheck_date, " +
		"convert(varchar(10), delivery_esti_date, 120) as delivery_esti_date, " +
		"convert(varchar(10), delivery_date, 120) as delivery_date, " +

		"currency, exchangerate, category, estiexchangerate, " +
		"receivecheckratio, checkquantity, name_q, wage " +
		"from orderitems " + 
		"where " + condstr +
		"order by jobno, subjobno, serialno, item asc";	

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
		await db.orderitems.create(val, { transaction: t });
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
		if (['jobno', 'subjobno', 'serialno', 'item'].indexOf(key) === -1) {
			updateobj[key] = val[key];
		}
	}
	const t = await db.sequelize.transaction();
	try {
		await db.orderitems.update(updateobj, {
			where: {
				jobno: val.jobno,
				subjobno: val.subjobno,
				serialno: val.serialno,
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
		await db.orderitems.destroy({
			where: {
				jobno: val.jobno,
				subjobno: val.subjobno,
				serialno: val.serialno,
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
		await db.orderitems.destroy({
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
