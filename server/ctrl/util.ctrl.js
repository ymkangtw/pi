const db = require('../models');
const xlsx = require('exceljs');
const docx = require('docx');
const dayjs = require('dayjs');
const _ = require('lodash');
//const fs = require('fs');
//const path = require('path');
const { Document, Packer, Header, Footer, Paragraph, TextRun, LevelFormat, AlignmentType, convertInchesToTwip, convertMillimetersToTwip, HeadingLevel } = docx;

var fileBuffer;

const addParagraph = (obj, text, size, bold, color, level) => {
    obj.sections[0].children.push(        
        new Paragraph({
            children: [
                new TextRun({
                    text: `${text}`,
                    font: '標楷體',
                    size: size * 2,
                    bold: bold,
                    color: color    
                }) 
            ],
            numbering: {
                reference: 'content-numbering',
                level: level
            }
        }),
    );
};

async function weekreportbygroup(req, res) {

    const rptData = Object.assign({}, req.body.data);
    //const rptData = Object.assign({}, req.query);

    //const group = req.query.group;
    //console.log('rptData:', rptData);
    let data = [];
    for (let i = 0; rptData[i] !== undefined; i++) {
        data.push(rptData[i]);
    }

    //console.log('data:', data);

	//const rows = { data: req.query['data'] + '!!!' };
    //let child = [];
    let obj = {
        numbering: {
            config:[
                {
                    reference: 'content-numbering',
                    levels: [                        
                        {
                            level: 0,
                            format: LevelFormat.DECIMAL,
                            text: '%1.',
                            alignment: AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: { left: convertMillimetersToTwip(14.8), hanging: convertMillimetersToTwip(6.3) },
                                },
                            },                    
                        },
                        {
                            level: 1,
                            format: LevelFormat.DECIMAL,
                            text: '%2)',
                            alignment: AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: { left: convertMillimetersToTwip(21.2), hanging: convertMillimetersToTwip(6.3) },
                                },
                            },                        
                        },
                        {
                            level: 2,
                            format: LevelFormat.LOWER_LETTER,
                            text: '%3.',
                            alignment: AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: { left: convertMillimetersToTwip(27.5), hanging: convertMillimetersToTwip(6.3) },
                                },
                            },                        
                        },                        
                        {
                            level: 3,
                            format: LevelFormat.LOWER_LETTER,
                            text: '%4)',
                            alignment: AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: { left: convertMillimetersToTwip(33.9), hanging: convertMillimetersToTwip(6.3) },
                                },
                            },                        
                        }, 
                    ]
                },
                {
                    reference: 'title-numbering',
                    levels: [
                        {
                            level: 0,
                            format: LevelFormat.TAIWANESE_COUNTING,
                            text: '%1、',
                            alignment: AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: { left: convertMillimetersToTwip(8.5), hanging: convertMillimetersToTwip(8.5) },
                                },
                                
                            },                    
                        },                        
                    ]
                }
            ],
        },
        sections: [{
            properties: {},
            children: [],
        }],
    };

    obj.sections[0].children.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: `${data[0].ofgroup} 工作週報`,
                    font: '標楷體',
                    size: 18 * 2,
                    bold: true,
                    color: '0000FF'    
                }) 
            ]
        }),
    );
    //console.log(`${data[0].ofgroup}`);

    const currDate = dayjs(new Date()).format('YYYY年MM月DD日');
    obj.sections[0].children.push(
        new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
                new TextRun({
                    text: currDate,
                    font: '標楷體',
                    size: 10 * 2,
                    bold: false,
                    color: '000000'    
                }) 
            ]
        }),
    );    

    obj.sections[0].children.push(        
        new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
                new TextRun({
                    text: `重點工作報告:`,
                    font: '標楷體',
                    size: 14 * 2,
                    bold: true,
                    color: '000000'
                }) 
            ],
            numbering: {
                reference: 'title-numbering',
                level: 0
            }
        }),
    );

    let i = 1;
    for (let item of data) {
        //console.log(sData);
        addParagraph(obj, `${item.jobname} 【${item.jobno}】 (${item.designtype}) (${item.status})`, 12, true, '0000FF', 0);

        //console.log(item.jobname); 
        let regex = /.*?[\r|\n]/g;
        //let p = `${item.weekwork}`.match(regex);
        let p = `${item.weekwork}`.match(regex);
        //console.log(p);
        const regex1 = /(?<=[1-9]{1,2}\.).*?[\r|\n]*$/g;
        const regex2 = /(?<=[1-9]{1,2}\)).*?[\r|\n]*$/g;
        const regex3 = /(?<=[a-z]\.).*?[\r|\n]*$/g;
        const regex4 = /(?<=[a-z]\)).*?[\r|\n]*$/g;

        await _.map(p, (it) => {
            //console.log(o);
            let m;
            if ((m = it.match(regex1)) !== null) { 
                //console.log(`${m}`.trim());
                addParagraph(obj, m, 12, false, '000000', 1);

            } else if ((m = it.match(regex2)) !== null) { 
                //console.log(`${m}`.trim()); 
                addParagraph(obj, m, 12, false, '000000', 2);
            
            } else if ((m = it.match(regex3)) !== null) { 
                //console.log(`${m}`.trim()); 
                addParagraph(obj, m, 12, false, '000000', 3);
                
            } else if ((m = it.match(regex4)) !== null) { 
                //console.log(`${m}`.trim());
                addParagraph(obj, m, 12, false, '000000', 4);

            } else {
                //console.log(`${it}`.trim());
                addParagraph(obj, it, 12, false, '000000', 1);

            }
        });


    }

    //console.log();
    const doc = new Document(obj);

    //const docfile = await Packer.toBase64String(doc);
    //const file = await Packer.toBuffer(doc);
    fileBuffer = await Packer.toBuffer(doc);
	//console.log(b64string);
	//res.setHeader('Content-Disposition', 'attachment; filename=downloadfile.docx');
    //res.setHeader('Content-Type', 'application/octet-stream');
    //res.send(Buffer.from(b64string, 'base64'));
    //Packer.toBuffer(doc).then((buffer) => {
    //    fs.writeFileSync('Document.docx', buffer);
    //});

	if (fileBuffer) {
		//res.status(200).json(rows);
		//res.status(201).send(Buffer.from(file, 'base64')).end();
        /*
        Packer.toBuffer(doc).then((buffer) => {
            fs.writeFileSync('Document.docx', buffer);
        });
        */
        res.status(201).send('Document.docx').end();
        
        /*
        Packer.toBuffer(doc).then((buffer) => {
            //fs.writeFileSync('Document.docx', buffer);
            res.status(201).send(buffer).end();
        });
        */
    
	} else {
		res.status(404).send('error');
	}
};

async function downloadfile(req, res) {
    //console.log('downloadfile:', req.query);
    //console.log(`Directory name is ${__dirname}`);
    //let file = fs.readFileSync('');
/*    
    filepath = 'D://work//project//pi//server//Document.docx';
    fs.readFile(filepath, (err, data) => {
        if (err) {
            console.log(err);
            res.status(404).send('404 - Not found');
        } else {
            console.log(data);
            res.status(200).send(data);
        }
    });
*/  
    if (req.query.file) {
        res.status(200).send(fileBuffer);
    } else {
        res.status(404).send('404 - Not found');
    }
    
    //res.status(200).send(file);

};

//設備請購明細表
async function orderreport(req, res) {
    const queryobj = Object.assign({}, req.body.data);
    console.log(queryobj)    

    if ( Number.isInteger(queryobj['subjobno']) ) {
        condition = "where jobno = $jobno and subjobno = $subjobno ";
    } else {
        condition = "where jobno = $jobno ";
    }
    console.log(condition);

	let querystr =
		"select jobno, subjobno, item, orderno, " +
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
        "convert(varchar(10), delivery_date, 120) as delivery_date, " +
        "replace(convert(nvarchar, cast(estimateamount as money), 1), '.00', '') as estimateamount, " +
        "replace(convert(nvarchar, cast(amount as money), 1), '.00', '') as amount, " +
        "currency " +
		"from orders " + condition +
		//"where jobno = 'T4107001W23' " +
        //"where jobno = '" + queryobj['jobno'] + "' " +
		"order by jobno, subjobno asc";
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
		res.status(404).send('error');
	}
    
};

module.exports = {
	weekreportbygroup,
    downloadfile,
    orderreport
};
