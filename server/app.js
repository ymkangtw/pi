const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

/*
const routes = {
	equip: require('./routes/equip'),
	//instruments: require('./routes/instruments'),
	//orchestras: require('./routes/orchestras'),
	// Add more routes here...
	// items: require('./routes/items'),
};
*/

var app = express();
var router = express.Router();

//app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cors({
//    origin:['http://localhost:80'],
//    methods:['GET', 'POST', 'PUT', 'DELETE']
//}));

// request static resource
app.use(express.static(path.resolve(__dirname, '../client/dist')));
app.use(express.static("d:\\DOC\\"));


//filePath = 'd:\\FTP\\MP\\';
//fileName = 'MPDATA-01.TXT';

//file = fs.readFileSync(filePath + fileName, 'utf8');
//console.log(file[0]);
/*
try {
	const data = fs.readFileSync('文件路径', 'utf8');
	console.log(data); // 打印文件内容
} catch (err) {
	console.error(err);
}
*/
//const newDirectory = 'd:\\FTP\\';
//process.chdir(newDirectory);

//console.log(__dirname);


// add REST api
require('./routes')(app);
//require('./routes')(app, router);

/*
const equipapi= require('./ctrl/equip.ctrl');
const equiptypeapi= require('./ctrl/equiptype.ctrl');
//console.log(equipapi);

//app.get('api/equip/', equipapi.getAll);
app.get('api/equip', function(req, res) {
	console.log('get api/equip/ request');
});

app.get('api/equip/:typeid', equipapi.getById);
app.post('api/equip/:typeid', equipapi.create);
app.put('api/equip/', equipapi.update);
app.delete('api/equip/', equipapi.remove);

app.get('api/equiptype/', equiptypeapi.getAll);
app.get('api/equiptype/:typeid', equiptypeapi.getById);
app.post('api/equiptype/:typeid', equiptypeapi.create);
app.put('api/equiptype/', equiptypeapi.update);
app.delete('api/equiptype/', equiptypeapi.remove);
*/

// request pages
app.get('/', function (req, res) {
	var html = fs.readFileSync(path.resolve(__dirname, '../client/dist/index.html'), 'utf-8');
	res.send(html);
});

// listen
const PORT = process.env.APP_PORT || 80;
app.listen(PORT, function () {
	console.log(`success listen...${PORT}`);
});
