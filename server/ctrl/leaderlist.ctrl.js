const db = require('../models');

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
		condstr = condstr + `l.${key} ${eq} $${key} and `;
	}
	condstr = condstr.slice(0, -4);
	let querystr = 
		"select l.jobno, l.employeeno, e.name, "+
		//"FORMAT(l.begindate, 'yyyy-MM-dd') as begindate, " +
		//"FORMAT(l.enddate, 'yyyy-MM-dd') as enddate, " +
		"convert(varchar(10), l.begindate, 120) as begindate, " +
		"convert(varchar(10), l.enddate, 120) as enddate, " +

		"l.note " +
	    "from leader l inner join employee e on l.employeeno = e.employeeno " + 
		"where " + condstr;
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
