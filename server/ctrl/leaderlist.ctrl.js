const db = require('../models');

async function getBy(req, res) {
	// query string 的 key 會直接串進 SQL（值有 bind、key 沒有），只允許 model 宣告的欄位名，防 SQL Injection
	const allowedKeys = Object.keys(db.leader.rawAttributes);
	let queryobj = {};
	let conds = [];
	for(const key in req.query) {
		if (allowedKeys.indexOf(key) === -1) {
			return res.status(400).send(`Bad request: unknown field ${key}`);
		}
		let val = req.query[key];

		if (val.slice(-1) == '%') {
			conds.push(`l.${key} like $${key}`);
			queryobj[key] = '%' + val;
		} else if (val == '' || val == null) {
			conds.push(`l.${key} like $${key}`);
			queryobj[key] = '%';
		} else {
			conds.push(`l.${key} = $${key}`);
			queryobj[key] = val;
		}
	}
	// 不帶任何參數時省略 where 子句，避免產生壞 SQL
	let wherestr = conds.length ? "where " + conds.join(" and ") + " " : "";
	let querystr = 
		"select l.jobno, l.employeeno, e.name, "+
		//"FORMAT(l.begindate, 'yyyy-MM-dd') as begindate, " +
		//"FORMAT(l.enddate, 'yyyy-MM-dd') as enddate, " +
		"convert(varchar(10), l.begindate, 120) as begindate, " +
		"convert(varchar(10), l.enddate, 120) as enddate, " +

		"l.note " +
	    "from leader l inner join employee e on l.employeeno = e.employeeno " + 
		wherestr;
		//console.log(querystr);
	//console.log(queryobj);

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

module.exports = {
	getBy
};
