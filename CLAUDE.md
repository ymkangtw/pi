# PI - 工程專案管理系統

## 系統概述
工程設計組織專案管理系統，涵蓋專案管理、團隊協作、採購追蹤、設計進度管理與 KPI 報表。
前後端分離架構：Vue 3 SPA (Webpack) + Express.js RESTful API + MS SQL Server (Sequelize ORM)。

## 技術棧

### 後端 (server/)
- Express.js v5.1.0, Sequelize v6.37.7, MS SQL Server 2017
- 文件產出：exceljs, docx
- 檔案上傳：express-fileupload, multer

### 前端 (client/)
- Vue.js v3.5.13 (Composition API), Vue Router v4.6.3
- 狀態管理：Pinia v3.0.3 + Vuex v4.1.0
- UI：Element Plus v2.11.5
- 圖表：ECharts v6.0.0, Chart.js v4.5.1, D3.js v7.9.0
- PDF：jsPDF (含繁體中文字型 NotoSansTC)
- HTTP：Axios v1.12.2, TypeScript v5.9.3 + JavaScript

## 目錄結構
```
pi/
├── package.json                     # npm workspaces root (client, server)
├── client/                          # 前端 Vue 3 SPA
│   ├── src/
│   │   ├── index.js                 # 應用程式進入點
│   │   ├── App.vue                  # 根元件（Header + Router Outlet）
│   │   ├── router/index.js          # Vue Router 路由設定（lazy loading）
│   │   ├── stores/                  # Pinia 狀態管理（sessionStorage 持久化，分頁隔離）
│   │   │   ├── user.js              # useUserStore：登入身分 identity（login/logout/updateIdentity）
│   │   │   └── selection.js         # useSelectionStore：畫面選擇狀態（sJobno/sSubjobno/sGroup/sTeam/sMember/hist/prjoption）
│   │   ├── service/                 # 32 個 Axios API 服務（相對路徑 /api/...）
│   │   ├── components/              # 25 個可重用元件
│   │   ├── views/                   # 40+ 頁面級元件
│   │   ├── util/                    # 工具函式庫
│   │   ├── controller/              # 狀態機控制器（FSM）
│   │   ├── assets/                  # 靜態資源（CSS、字型）
│   │   └── pic/                     # 圖片/圖示
│   ├── dist/                        # Webpack 打包輸出
│   └── webpack.config.js            # Webpack 設定（含 dev proxy）
├── server/                          # 後端 Express.js API
│   ├── app.js                       # Express 主程式（Port 80 或 APP_PORT）
│   ├── routes.js                    # 路由定義
│   ├── ctrl/                        # 32 個控制器
│   ├── models/                      # 27 個資料模型（Sequelize, dotenv 載入 .env）
│   ├── .env                         # DB 環境變數（不進版控）
│   └── .env.example                 # .env 範本
```

## Commands
```bash
npm run dev    # 開發模式（concurrently 同時啟動 server + client，client port 8080 proxy 到 server）
npm run build  # 編譯 client（webpack production → client/dist/）
npm start      # 啟動 server（node app.js）
```

## 頁面路由對照

| 路由代碼 | 功能說明 |
|----------|----------|
| `/` | 首頁 |
| `/overview` | 專案流程總覽 |
| `/document` | 設計標準與公安文件 |
| **UA01~02** | 登入/登出、帳號編輯 |
| **PF01~04** | 專案執行/委外/長約/採購流程 |
| **PM01** | 專案列表（全部/組別）|
| **PM02** | 專案資料管理（子頁 PD01~PD06：基本資料、內容、人員、設計規劃、進度、報表）|
| **PM03~05** | 專案搜尋、統計、報表 |
| **PQ01~03** | 專案查詢、訂單查詢、設計文件查詢 |
| **PR01~04** | 三層/二層 週報、三層/二層 月報 |
| **PS01~03** | KPI 與統計分析 |
| **ED01~02** | 設計標準、公安文件 |

## API 架構

標準 CRUD：
```
GET    /api/{resource}/        → getAll()
GET    /api/{resource}/getby   → getBy()
POST   /api/{resource}/        → create()
PUT    /api/{resource}/        → update()
DELETE /api/{resource}/        → remove()
```

Common Controller 特殊端點：KPI、採購金額（請購/訂購/交貨/驗收，各有預估與實際）、加班統計。

## 資料模型（27 個）

- **專案**：basic, estibyproject, estibyitem, monthbyproject, monthbyitem, contents
- **人員**：employee, leader, member, uteam, ugroup
- **採購**：orders, orderitems, ordercategory
- **工作追蹤**：task, taskcategory, joblist, drawingno, isodocs
- **報表**：weeklyreportbyprj, monthreportbyprj, weeklyworkbyproject, monthprgbyprojecttotal
- **查找表**：equiptype, equip, servicevalue, factorycode

## 學科代碼

| 代碼 | 含義 |
|------|------|
| ID | 儀器設計 | BD | 基本設計 | DD | 細部設計 |
| CNT | 控制 | DCS | 分散式控制系統 | PLC | 可程式邏輯控制器 |
| BUY | 採購 | CON | 施工 | COM | 試車 | RPT | 報告 |

## 狀態管理與登入

- 登入狀態以兩個 Pinia store 分離管理，並由 `index.js` 的外掛持久化到 **sessionStorage**（key：`pi_user`、`pi_selection`），達成各瀏覽器分頁互相獨立、F5 不遺失：
  - `useUserStore.identity`：登入身分（整筆 employee 紀錄），只在登入/登出/帳號編輯時變動
  - `useSelectionStore`：畫面選擇狀態（sJobno、sSubjobno、sGroup、sTeam、sMember、hist、prjoption），各頁面讀寫
- 頁面慣例：身分讀取用 `const user = userStore.identity`（template 存取以 `user?.xxx` 防未登入時 null）；選擇狀態讀寫用 `sel.xxx`，不再手動操作 localStorage/sessionStorage（`util.js` 的 `loadObj/saveObj` 已成死碼）
- 登入僅比對職工編號是否存在，**尚未驗證密碼**，後端亦未驗證憑證（信任前端傳入的參數）
- 登入頁（UA01）以 **localStorage** key `pi_lastEmployeeno` 記住上次成功登入的職工編號，開新分頁進登入頁時自動預填；此為純預填提示（跨分頁共享），非登入狀態，不影響分頁隔離
- 判斷選擇狀態是否為空時，要判斷**值本身**（如 `_.isEmpty(sel.hist.link)`），不可判斷 store 物件（如 `_.isEmpty(sel.hist)`）——Pinia 初始值是有 key 的物件，`_.isEmpty` 永遠為 false（舊版 localStorage 讀不到會回 null，行為不同）

## 開發注意事項

- Raw SQL 使用 Sequelize `bind` 參數（`$paramName`）防止 SQL Injection
- `.update()` / `.destroy()` 的 `{ transaction: t }` 必須放在第 2 個引數的 options 物件內
- 資料庫帳密透過 `dotenv` 從 `server/.env` 載入
- Vue Router 除首頁外全部使用 lazy loading（`() => import(...)`）
- 前端 API 呼叫使用相對路徑 `/api/...`，dev 模式透過 webpack proxy 轉發到後端
- 部署時 Express 靜態服務 `client/dist/` 作為前端入口，`D:\DOC\` 提供靜態文件
- SPA 深層路徑（如 `/PM01`）重新整理由 `app.js` 的 fallback 路由（RegExp 排除 `/api`）回傳 `index.html`，交前端 Vue Router 處理；Express 5 不支援 `app.get('*')`，需改用 RegExp 或具名萬用字元；dev 模式（webpack-dev-server）則由 `devServer.historyApiFallback: true` 處理
- dev 模式的錯誤覆蓋層以 `devServer.client.overlay.runtimeErrors` 過濾掉 `ResizeObserver loop` 良性警告（Element Plus 元件重排常觸發），其餘 runtime error 照常顯示；修改 webpack.config.js 後需重啟 `npm run dev` 才生效
- PM01 的 team/group/member 元件以 `defineExpose` 暴露內部選單值，父頁需透過 `refXxx.value.xxx` 賦值才會改變顯示；team 元件僅 DBDesigner 渲染（`v-if`），賦值前需檢查 `refTeam.value` 存在
