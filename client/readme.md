# **RUN APP**

## Development:
* npm run dev
  build (watch mode)
* npm run serv
  run webpack-dev-server

## Production:
* npm run build
  build

## npm install
* npm insatall [package] --save
* npm install [package] --save-dev

## npm uninstsall
* npm uninstall [package] --save
* npm uninstall [package] --save-dev

## global install
* npm install -g [package]
* npm uninstall -g [package]

## Vuetify 3 install
* npm install vuetify@3.1.1 --save

## Vuedraggable [注意!!]
* npm install vuedraggable@next --save

## vue-datepicker install
* npm install @vuepic/vue-datepicker --save

## echarts vue-echarts
* npm install echarts vue-echarts --save

## jsPDF desplay NotoSansTC Font
* https://fonts.google.com/noto/specimen/Noto+Sans+TC
* Select Chinese(Traditional)
* GetFont(UpRight of Page)
* Download all
* GitHub download jsPDF.zip and extract
* \jsPDF\fontconverter\fontconverter.html
* convert NotoSansTC to .js file
* import '@/assets/NotoSansTC-normal.js';

## 更新npm package
* npm outdated
  檢查package(package.json)是否有新版本
  若發現current版本比latest新, 有可能是npm指向不同的package
  ex: vuedraggable有vue2(vue.draggable)/vue3(vue.draggable.next)版本, npm outdated顯示的是vue2版
* npm update --save
  更新package及package.json(--save)
  npm update不會更新major version, 須自行修改package.json版本號再npm update
  major版本更新有可能會使既有程式無法執行, 更新後須測試功能及檢查是否有error/warning message

***

# **Views**
## home
* 首頁

## overview
* 導覽
  * 工程執行流程
  * 工程資料查詢
  * 請購資料查詢
  * 工程管理

## document
* 設計標準 (ISO文件)
* 公安文件

## project
* 工程管理

## User Account
* UA01: Account Login, 登入/登出
* UA02: Account Edit, 帳號資料編輯

## Project Manager
* PM01: Project List, 工程清單(all/team)
* PM02: Project Data, 工程詳細資料
* PM03: Project Search, 資料查詢
* PM04: Project Statistics, 統計資料
* PM05: Project Report, 工程報表

## Project Flow Chart
* PF01: Project Execution Process, 專案執行流程
* PF02: Project Outsourcing Process, 個案外包流程
* PF03: Long-term Contract Process, 長約外包流程
* PF04: Procure

## Project Design
* PD01: Basic data, 基本資
* PD02: Project Content, 工程內容
* PD03: Leader/Member, 專案成員
* PD04: Estimate Design Item, 設計規劃
* PD05: Actual Progress, 設計進度
* PD06: Weekly Report, 工作報告(週報,月報)
* PD07: Weekly Report, 週報
* PD08: Monthly Report, 月報
* PD09: Orders/Order Item, 請購/發包/長約項目&細項

## Document Approval
* DA01: Document Upload/Submit/Approval, 文件上傳審核
* DA02: Approval Document List, 審核文件清單
  
## Project Query
* PQ01: Project Query, 工程案件查詢
* PQ02: Order/Order Item Query, 購案/外包/長約查詢
* PQ03: Document Query, 設計文件查詢
* PQ04: ISO Document Query, ISO文件查詢
* PQ05: Statistics, 工程統計資料
  * 進行中工程案
  * 
## Project Report
* PR01: 三級週報
* PR02: 二級週報
* PR03: 三級月報
* PR04: 二級月報

## Project Statistics
* PS01: KPI

## Engineering Design
* ED01: 設計標準
* ED02: 公安文件

注意: textarea列數設定 :rows=10