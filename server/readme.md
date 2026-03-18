# **Software Version**
* OS: Windows Server 2019
* DB: SQL Server 2017
* Package: Sequelize v6 (v6: MSSQL 2014-2019, v7: MSSQL 2017-2022)
* Node.js: v22.16.0 (current)

## Server設定
* Webserver 安裝 Microsoft OLE DB Driver 19 for SQL Server (x64).msi
* DB Server開啟 SQL Server Configuration Manager，檢查以下設定:
  a.SQL Server服務: SQL Server, SQL Server Browser, SQL Server Agent須自動啟動
  b.SQL Server網路組態: MSSQLSERVER通訊協定 TCP/IP已啟用
* 以系統管理員身分執行 opensqlport.bat

# **RUN APP**

## Development:
* npm run dev
  build (watch mode)
## Production:
* npm run build
  build

## npm install
* npm install [package] --save
* npm install [package] --save-dev

## nodemon
* nodemon app.js
* nodemon -x "node app.js"


## list npm global installed package 
* npm list -g

## pm2
* start service
  pm2 start --name piapp app.js
  pm2 start --name piapp app.js --watch
  pm2 start --name piapp app.js --watch --exp-backoff-restart-delay=500
* stop service
  pm2 stop piapp
  pm2 delete piapp
* list service
  pm2 list
* terminal monitor
  pm2 monit
* clear logs
  pm2 flush piapp
  pm2 flush appName|appId
 