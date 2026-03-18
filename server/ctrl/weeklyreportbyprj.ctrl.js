//const { sequelize } = require('../models');
const db = require('../models');

async function getAll(req, res) {
	let querystr = 
		"select jobno, " +
		"convert(varchar(10), inputdate, 120) as inputdate, " +
		"ofgroup, weekwork " +
		"from weeklyreportbyprj " +
		"order by ofgroup, inputdate asc";
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
		condstr = condstr + `w.${key} ${eq} $${key} and `;
	}
	condstr = condstr.slice(0, -4); //slice " and ".len()

	let querystr = 
		"select w.jobno, b.jobname, " +
		"convert(varchar(10), w.inputdate, 120) as inputdate, " +
		"w.ofgroup, w.weekwork " +
		"from weeklyreportbyprj w " +
		"inner join basic b on w.jobno = b.jobno " +
		"where " + condstr +
		"order by w.ofgroup, w.inputdate asc";
/*
	let querystr = 
		"select jobno, " +
		"convert(varchar(10), inputdate, 120) as inputdate, " +
		"ofgroup, weekwork " +
		"from weeklyreportbyprj where " + condstr +
		"order by ofgroup, inputdate asc";
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

async function create(req, res) {
	let val = req.body.data;
	console.log(val);
	const t = await db.sequelize.transaction();
	try {
		await db.weeklyreportbyprj.create(val, { transaction: t });
		await t.commit();
		res.status(201).send('created').end();
	} catch (error) {
		await t.rollback();
		console.log('insert error! ' + error);
		res.status(404).send(`Bad request: param ID: ${val.inputdate} ${val.ofgroup1}`);
	};
};


async function update(req, res) {
	let val = req.body.data;
	let updateobj = {};
	for(const key in val) {
		if (['jobno', 'inputdate', 'ofgroup'].indexOf(key) === -1) {
			updateobj[key] = val[key];
		}		
	}
	const t = await db.sequelize.transaction();
	try {
		await db.weeklyreportbyprj.update(updateobj, {
			where: {
				jobno: val.jobno,
				inputdate: val.inputdate,
				ofgroup: val.ofgroup
			},
			transaction: t
		});
		await t.commit();
		res.status(201).send('updated').end();
	} catch (error) {
		await t.rollback();
		console.log('update error! ' + error);
		res.status(404).send(`Bad request: param ID: ${val.inputdate} ${val.ofgroup1}`);
	};

};

async function remove(req, res) {
	let val = req.body;
	const t = await db.sequelize.transaction();
	try {
		await db.weeklyreportbyprj.destroy({
			where: {
				jobno: val.jobno,
				inputdate: val.inputdate,
				ofgroup: val.ofgroup
			},
			transaction: t
		});
		await t.commit();
		res.status(201).send('removed').end();
	} catch (error) {
		await t.rollback();
		console.log('delete error! ' + error);
		res.status(404).send(`Bad request: param ID: ${val.inputdate} ${val.ofgroup1}`);
	};
};

// input format: { inputdate1: 週開始日期, inputdate2: 週結束日期, ofgroup1: 組別(三級) }
async function getWeekworkByGroup(req, res) {
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
		//condstr = condstr + `${key} ${eq} $${key} and `;
		
	}
	//condstr = condstr.slice(0, -4); //slice " and ".len()
	
	let querystr = 
		"select b.jobno, b.jobname, " +
		"convert(varchar(10), w.inputdate, 120) as inputdate, " +
		"m.subjobno, e.employeeno, e.name, w.content " +		
		"from weeklyworkbyproject w " +
		"inner join basic b on w.jobno = b.jobno " +
		"inner join member m on w.jobno = m.jobno and w.subjobno = m.subjobno " + 
		"inner join employee e on m.employeeno = e.employeeno " +
		"where e.ofgroup1 = $ofgroup and w.inputdate >= $inputdate1 and w.inputdate <= $inputdate2 " +
		"order by b.jobname, b.jobno, w.subjobno asc";

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

async function getWeekworkByPrj(req, res) {
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
		//condstr = condstr + `${key} ${eq} $${key} and `;
		
	}
	//condstr = condstr.slice(0, -4); //slice " and ".len()
	//console.log(queryobj['inputdate1']);
	//console.log(queryobj['inputdate2']);
	let querystr = 
		"select b.jobno, b.jobname, " +
		"convert(varchar(10), w.inputdate, 120) as inputdate, " +
		"m.subjobno, e.employeeno, e.name, w.content " +		
		"from weeklyworkbyproject w " +
		"inner join basic b on w.jobno = b.jobno " +
		"inner join member m on w.jobno = m.jobno and w.subjobno = m.subjobno " + 
		"inner join employee e on m.employeeno = e.employeeno " +
		"where b.jobno = $jobno and w.inputdate >= $inputdate1 and w.inputdate <= $inputdate2 " +
		"order by b.jobname, b.jobno, w.subjobno asc";

	//console.log(querystr);	

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
// input format: { inputdate1: 週開始日期, inputdate2: 週結束日期, ofgroup1: 組別(三級) }
async function getWeekreportByGroup(req, res) {
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
		//condstr = condstr + `${key} ${eq} $${key} and `;
		
	}
	//condstr = condstr.slice(0, -4); //slice " and ".len()
	
	let querystr = 
		"select b.jobno, b.jobname, " +
		"convert(varchar(10), w.inputdate, 120) as inputdate, " +
		"w.ofgroup, w.weekwork, b.designtype, b.status " +		
		"from basic b " +
		"inner join weeklyreportbyprj w on b.jobno = w.jobno " +
		"where w.ofgroup = $ofgroup and w.inputdate >= $inputdate1 and w.inputdate <= $inputdate2 " +
		"order by b.jobname, b.jobno asc";

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
	create,
	update,
	remove,
	getWeekworkByGroup,
	getWeekworkByPrj,
	getWeekreportByGroup
};
