# PI - 工程專案管理系統

## 系統概述
工程設計組織專案管理系統，涵蓋專案管理、團隊協作、採購追蹤、設計進度管理與 KPI 報表。
前後端分離架構：Vue 3 SPA (Webpack) + Express.js RESTful API + MS SQL Server (Sequelize ORM)。

## 技術棧

### 後端 (server/)
- Express.js v5.1.0, Sequelize v6.37.7, MS SQL Server 2017
- 文件產出：exceljs, docx
- 檔案上傳：multer

### 前端 (client/)
- Vue.js v3.5.13 (Composition API), Vue Router v4.6.3
- 狀態管理：Pinia v3.0.3
- UI：Element Plus v2.11.5
- 圖表：ECharts v6.0.0, D3.js v7.9.0
- PDF：jsPDF (含繁體中文字型 NotoSansTC)
- HTTP：Axios v1.12.2
- 語言：純 JavaScript（2026-07-29 移除 TypeScript / ts-loader，見 Backlog P2-4）

## 目錄結構
```
pi/
├── package.json                     # npm workspaces root (client, server)
├── package-lock.json                # 根 lock（已納入版控，全專案唯一一份，見 Backlog P2-8）
├── node_modules/                    # 全專案唯一一份（326 MB／42,701 檔，2026-07-29 重裝 hoist）
│   ├── piapp -> client/             # workspace junction（名稱取自 client/package.json 的 name）
│   └── piserv -> server/            # workspace junction，npm run -w 靠它定位
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
│   ├── routes/                      # 路由定義（index.js 自動載入同目錄 *.route.js）
│   ├── ctrl/                        # 32 個控制器
│   ├── models/                      # 26 個資料模型（Sequelize, dotenv 載入 .env）
│   ├── .env                         # DB 環境變數（不進版控）
│   └── .env.example                 # .env 範本
├── docs/                            # 專案文件
│   └── ER-Model.md                  # 資料庫 ER Model（Mermaid，含關聯依據與注意事項）
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
| **PQ01~03** | 專案查詢、訂單查詢、設計文件查詢（PQ03 目前是「對話測試」實驗頁，非查詢功能）|
| **PR01~04** | 三層/二層 週報、三層/二層 月報（僅 PR01 已實作，PR02~04 為只有標題的空殼頁）|
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

## 資料模型（26 個）

- **專案**：basic, estibyproject, estibyitem, monthbyproject, monthbyitem, contents
- **人員**：employee, leader, member, uteam, ugroup
- **採購**：orders, orderitems, ordercategory
- **工作追蹤**：task, taskcategory, drawingno, isodocs
- **報表**：weeklyreportbyprj, monthreportbyprj, weeklyworkbyproject, monthprgbyprojecttotal
- **查找表**：equiptype, equip, servicevalue, factorycode

ER Model 詳見 `docs/ER-Model.md`（含關聯一覽表與注意事項）。補充：`basic.serialnorule` 為 2026-07-28 新增欄位（請購序號遮罩，詳見開發注意事項），ER-Model.md 尚未同步；joblist 只有 route/ctrl 沒有 model（跨表彙總查詢）；`overtime` 資料表存在於 DB 但無 model 檔（common.ctrl.js 加班統計直接以 Raw SQL 存取）；model 宣告的 primaryKey 大多與邏輯主鍵不符，不可依 model 宣告理解資料結構。

## 工作項目代碼

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
- 登入僅比對職工編號是否存在，**尚未驗證密碼**，後端亦未驗證憑證（信任前端傳入的參數）；登入成功後導向 `/project`（工程管理選單頁）並 reload 讓 Header 更新身分
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
- **建置檔名與快取**（2026-07-25 導入）：production build 的 `output.filename` / `output.chunkFilename` 帶 `[contenthash:8]`（`bundle.xxxxxxxx.js`、`[id].bundle.xxxxxxxx.js`），內容沒變 hash 就不變（webpack 5 production 預設 deterministic ids），改一支 view 只有該 chunk 與主 bundle 換檔名；**development 必須維持固定檔名**，HMR 與 contenthash 不相容會直接編譯失敗，`HotModuleReplacementPlugin` 也因此改為僅 development 掛載。配套是 `app.js` 讓 `index.html` 回 `Cache-Control: no-cache`（express.static 的 `setHeaders`、`app.get('/')`、SPA fallback 三處都要設，後兩者繞過 static），否則瀏覽器快取住舊 html、裡面寫的還是舊 hash，等於沒改。註解類修改重 build 後 hash 不變是正常的——production 壓縮後產出內容相同。反過來，**動 `webpack.config.js` 的 `module.rules` 會讓幾乎所有 chunk 換檔名**：vue-loader 產生的 inline request 帶 `ruleSet[1].rules[N]` 索引，刪掉一條 rule 會讓後面的規則全部位移，連帶改變 module identifier、deterministic id 與 contenthash（2026-07-29 移除 `.tsx?` rule 實測：54 個檔案的 chunk id 與 hash 全變，總位元組只差 3 bytes——差的是 id 位數）。這是一次性重新編號、不是內容變動，但**做基準比對驗證時必須把 rules 的改動單獨隔離出來測**，否則會誤判成「產出變了」
- **跑 `npm run dev` 會清空 `client/dist/`**：`CleanWebpackPlugin` 在 dev server 啟動時就執行清除，但 webpack-dev-server 的產出只存在記憶體（不寫磁碟），所以 dev server 一停，`dist` 就是空的——看起來像部署檔還在，實際已無。開發完要部署或用 port 80 實跑前，務必重新 `npm run build`
- **npm workspaces 安裝規則**（2026-07-29 盤點）：一律從根目錄下指令——`npm install`（全部）／`npm install -w client <pkg>`（裝到某個 workspace）／`npm install -D <pkg>`（裝到根，僅限跨 workspace 的工具如 concurrently），**絕不可 `cd client && npm install`**。2026-07-29 重裝前，三份 `node_modules` 完全沒 hoist（共 391.7 MB／50,565 檔）就是這樣造成的：client／server 的 `node_modules` 建於 2026-03-17、早於根目錄 03-18，npm arborist 讀到既有樹後傾向不搬移，於是 185 個版本相同的套件兩邊各存一份。現已重裝為單一 `node_modules`（326 MB／42,701 檔，見 P2-10），**再犯一次就會退回原狀**。另外三條：(a) lock 檔只該有根層一份，`client/`／`server/` 底下那兩份是改 workspaces 前的殘留；(b) 套件實體被 hoist 到根**不代表宣告可以省**，子 `package.json` 必須宣告自己 import 的每一個套件，否則是 phantom dependency——現在能跑可能只因為另一邊裝了同一個套件，那邊一移除就無預警壞掉；(c) server 執行期 `require()` 到的一律放 `dependencies`，放 `devDependencies` 在 `npm ci --omit=dev` 部署時會 MODULE_NOT_FOUND（`cors` 已中招，見 P2-12）；client 因為打包後只出 `dist/`、`node_modules` 不上線，放哪不影響部署，但仍照慣例分
- 使用 lodash 的檔案一律明確 `import _ from 'lodash'`，不可依賴 webpack AMD 模擬讓 lodash 掛上 `window._` 的副作用（2026-07-21 已全數補齊）
- 通用工具 CSS（`.ma2/.ma4/.ma8/.ma16`、`.mv2/.mv4/.mv8`、`.fstart/.fcenter/.fend`、`.item-align`、`.shadow`）集中於 `assets/style.css`，元件內不再重複定義；同名但內容不同者（PD04 的 `.fstart`、PM01 與 App.vue 的 `.item-align`）保留在元件內，以 scoped 較高特異度覆蓋全域
- `el-col` 上掛 `.fstart/.fcenter/.fend` 會被 Element Plus 的 `.el-col-N { display: block }` 蓋掉（bundle 排序在 style.css 之後），style.css 已用 `.el-col.fstart` 等較高特異度規則還原 flex；需要「保留上下間距但右緣要對齊容器」時用 `.mv*`（垂直 margin），不要用 `.ma*`（四邊 margin 會造成水平內縮/偏移）
- 以 PowerShell 腳本批次修改檔案時，必須用 `[System.IO.File]::ReadAllText/WriteAllText` 讀寫（UTF-8）；PS 5.1 的 `Get-Content` 預設 ANSI 編碼會把中文弄成亂碼
- dev 模式的錯誤覆蓋層以 `devServer.client.overlay.runtimeErrors` 過濾掉 `ResizeObserver loop` 良性警告（Element Plus 元件重排常觸發），其餘 runtime error 照常顯示；修改 webpack.config.js 後需重啟 `npm run dev` 才生效
- PM01 的 team/group/member 元件以 `defineExpose` 暴露內部選單值，父頁需透過 `refXxx.value.xxx` 賦值才會改變顯示；team 元件僅 DBDesigner 渲染（`v-if`），賦值前需檢查 `refTeam.value` 存在
- PD05 請購管理的兩個表格採「點列才編輯」（`row === editingOrder/editingItem` 才渲染編輯元件，其餘列純文字）——整表掛編輯元件會嚴重卡頓（曾實測開啟 2 秒、每鍵擊 400ms）；點表格外離開編輯的 `exitEditing` 必須掛在 `@click.capture`，冒泡階段才判斷時 `event.target` 可能已因進入編輯的重渲染脫離 DOM，`closest('.el-table')` 會誤判成表格外而立刻取消編輯
- **請購序號規則**（2026-07-28 導入）：`basic.serialnorule`（nvarchar(10)）是**遮罩**，`#` 標示流水碼位置且必須連續置尾（1~5 個），如肆號高爐的 `D2R75##` → 前綴 `D2R75`、流水碼 2 碼；空值走既有「民國年+單位碼+3 碼」（如 `115S001`，依**登入者** `ofgroup1` 決定單位碼，故不可用來表達工程專屬規則）。流水碼序列以寬度 2 為例是 `01`~`99` → `0A`~`9Z` → `AA`~`ZZ`（共 1035 個），字母由右往左逐位侵蝕；**取最大號必須換算成 index 比大小，不可用字串比**——ASCII 裡 `'99' > '0A'`，但 `0A` 才是 99 的下一號，用字串比會算出 `100` 並無限卡住。3 碼以上的進位方式是推論，尚未經工程部門確認。相關程式集中在 `PD05.vue` 的 `parseSerialRule`/`serialIndexToCode`/`serialCodeToIndex`/`getNewSerailNo`，規則在 PD01「其他」頁籤維護（限 DBDesigner）
- 承上，序號取 max 依賴兩件事：(a) `orders.y6tserialno` 是 **char(12)**，回傳帶尾端空白，靠前端 `trimJSON` 清掉；若日後照 P5-6 改用 SQL 端 rtrim，**orders 這條路徑必須一起改**，否則 `'02     '` 長度不符會解析失敗回 0，下一號算成 `01` 與既有號重複且畫面看不出來。(b) 後端 getBy 的 `like` 是前後包 `%`（傳 `D2R75%` 實際查 `%D2R75%`，是「包含」不是「開頭」），故迴圈內另以 `indexOf(prefix) != 0` 濾掉誤撈
- 「請購管理」按鈕只在該工程有 `jobtype='P'` 的任務、且 PD05 選了**特定成員**（非「全案」）時才顯示（`PD05.vue` 的 `v-if="item.jobtype == 'P'"`）；沒有請購任務的工程即使已有請購案，UI 上也到不了新增購案畫面
- orders/orderitems 的 getBy 回傳單價/總價是 SQL `convert(money)` 格式化的帶逗號字串（顯示值），寫回 DB 前必須以 `pv()` 轉回數字；細項新增/更新/刪除後由 `syncOrderFromItems()` 依細項重算請購案總價與交貨/驗收日期，寫 DB 並同步畫面上的 orders 列
- **getBy 白名單標準模式**（2026-07-25 全面套用，防 SQL Injection）：`const allowedKeys = Object.keys(db.<model>.rawAttributes);`，名單外的 query key 回 400；條件用 `conds` 陣列收集再 `join(" and ")`，無參數時省略 `where` 子句（行為同 getAll）。變體：isodocs 用 `or` 連接且一般值轉 `%值%` 包含查詢；leaderlist/memberlist 無自己的 model，分別用 `db.leader`/`db.member`；common.ctrl 的 condstr 是死碼（key 從未進 SQL）不需白名單；joblist 因 SQL 含多層 join/subquery，採**只插入白名單檢查、不動 condstr 與 SQL** 的保守修法（條件掛 employee 別名 `e.` 的 5 個函式用 `db.employee`，Idreport/Fnreport 用 `db.basic`），改動前後以真實參數逐位元組比對回應驗證
- **model 欄位宣告必須涵蓋前端查詢用到的所有 DB 欄位**——白名單以 model 為唯一依據，前端查 model 未宣告的欄位會被 400 誤擋（教訓：uteam 的 `visible` 欄位 DB 有、model 沒宣告，PM01/PS01/PS02 都用 `getBy({visible:1})` 篩選團隊，已補宣告）；新增 controller 測試時，測試用的欄位名要先查 model 確認存在
- PDF 報表（PD05 工程月報 / 進度管制表 / 專案報告）由 `util.service.js` 以 **jsPDF 純前端產生**（含 NotoSansTC 中文字型、甘特圖），最後 `doc.save()` 建 Blob 觸發下載，不經後端；**用 Playwright 等自動化瀏覽器測試時，下載檔會落在 CDP 指定目錄並以隨機 GUID 命名**（真實檔名改由 `downloadWillBegin` 事件的 suggestedFilename 傳遞），看起來像「功能無效」，實際檔案完好——腳本要保留檔名須用 `download.suggestedFilename()` + `saveAs()`；此現象與 `--no-sandbox` 無關，一般瀏覽器操作會正常存成 `${jobno}-${jobname}.pdf`

## 待改進事項（Backlog，2026-07-21 盤點，2026-07-25 架構評估補充，2026-07-27 改為表格，2026-07-29 相依盤點補充）

架構評估結論（2026-07-25）：分層骨架（前後端分離 SPA + RESTful API、route → ctrl → model、前端 service 層 + Pinia + Composition API、Raw SQL + bind）符合現代主流，**不需要為了潮流重構架構本身**；真正的落差在安全性、錯誤處理、測試與工具鏈等工程品質面，優先序如下。

依優先權排列（排序依據：影響 × 成本），動工前先與使用者確認。狀態：✅ 完成 / ⬜ 未做。

| 編號 | 項目 | 狀態 | 完成日 | 說明 |
|---|---|---|---|---|
| **P1 安全（最優先，影響最大）** |||||
| P1-1 | 後端驗證（方案 C） | ⬜ | | 登入不驗密碼、API 無任何身分驗證中介層，任何人可直接呼叫 `/api/...` 讀寫資料（employee 含個資）；登入回傳整筆 employee 過寬 |
| P1-2 | getBy SQL Injection 白名單 | ✅ | 2026-07-25 | 28 個 controller 已加白名單（含 joblist 7 個函式、equiptype）；equip.ctrl 走 Sequelize model API 本來就安全。模式詳見開發注意事項 |
| **P2 高效益低成本（實際 bug 或幾乎零成本）** |||||
| P2-1 | lodash 明確 import | ✅ | 2026-07-21 | 不再依賴 webpack AMD 模擬讓 lodash 掛上 `window._` 的副作用 |
| P2-2 | webpack `[contenthash]` + index.html no-cache | ✅ | 2026-07-25 | 解決部署後瀏覽器吃舊快取。詳見開發注意事項 |
| P2-3 | 移除未使用的 vuex | ✅ | 2026-07-27 | 連同 webpack alias 一併移除（含相依共 18 個套件）；狀態管理只有 Pinia 的 `stores/user.js`、`stores/selection.js`。移除前後 production build 產出位元組完全相同（`bundle.08f33870.js`，54 檔 18,168,887 bytes），證明從未被打包 |
| P2-4 | 移除 typescript / ts-loader / tsconfig.json | ✅ | 2026-07-29 | 原以為專案無 `.ts` 檔，實際有 4 個 2025-06 留下的空殼（`src/util/func.ts` 只有註解掉的 3 行、`func.d.ts` 0 行、`placeholder.ts` 0 行、`placeholder.d.ts` 只有 `export {}`），全專案 0 處 import（元件一律 `import * as util from '@/util/utils.js'`，是 .js）。已刪 4 個檔＋`tsconfig.json`，移除 `typescript`／`ts-loader` 宣告，webpack 拿掉 `.tsx?` rule 與 `resolve.extensions` 的 `.ts` |
| P2-5 | 引入 ESLint + Prettier | ⬜ | | |
| P2-6 | 補最小測試框架 | ⬜ | | 後端 controller 與前端金額計算邏輯（如 PD05 `syncOrderFromItems`）優先 |
| P2-7 | CI | ⬜ | | 行有餘力再加 |
| P2-8 | `package-lock.json` 納入版控 | ✅ | 2026-07-29 | 原本被 `.gitignore` 忽略，53 個直接相依全用 `^` 範圍，別人 clone 後 `npm install` 裝到的不是同一組版本——「build 不過」多半源自此，比 Node 版本嚴重（實測佐證：不帶 lock 從頭安裝，337 個套件版本與現況不同，見 P2-10）。作法：`.gitignore` 刪掉 `package-lock.json` 該行（**不改成忽略子層兩份**——日後誤跑 `cd client && npm install` 冒出的 lock 要能出現在 `git status` 當警訊），刪除 `client/package-lock.json` 與 `server/package-lock.json`（皆 2026-03-17 殘留，workspaces 專案只該有根層一份），提交根層 lock。這份 lock 同時是 P2-10 的第一層退路 |
| P2-9 | 記錄 Node 版本需求 | ⬜ | | 目前 `.nvmrc`／`.node-version`／`engines`／CI 全都沒有（2026-07-28 盤點）。實測環境 Node v22.20.0 + npm 10.9.3；由已安裝套件反推下限為 Node ≥ 18，但 minimatch 等宣告 `18 \|\| 20 \|\| >=22`，奇數非 LTS 版不支援。建議根 package.json 加 `engines`（`^18.12 \|\| ^20.9 \|\| ^22.11 \|\| ^24`）＋ `.nvmrc`；要強制擋則另加 `.npmrc` 的 `engine-strict=true` |
| P2-10 | 三個 `node_modules` 重裝為正常 hoist 結構 | ✅ | 2026-07-29 | **結果：50,565 檔／391.7 MB → 42,701 檔／326.0 MB（省 7,864 檔／65.7 MB），`client/`／`server/` 底下不再有 `node_modules`，兩個 junction 由 npm 自動重建。`npm install` 42 秒（cache 熱），776 packages。lock 內套件 720 → 665 種，187 個版本變動、其中 45 個跨大版號。驗證全過，詳見下方「P2-10 執行記錄」。** 以下為原始盤點依據——現況三份共 391.7 MB／50,565 檔：`node_modules/`（7.1 MB，只有 `concurrently`＋`nodemon` 及其相依，另有 `piapp`→`client`、`piserv`→`server` 兩個 junction，是 workspaces 的定位機制）、`client/node_modules/`（253.1 MB）、`server/node_modules/`（131.5 MB）。root lock 明確把 525／461 筆記在子層，等於**完全沒有 hoist**——因為 client／server 的 `node_modules` 建於 2026-03-17，比 root（03-18）早，npm arborist 讀到既有樹後傾向不搬移。兩邊重複且版本完全相同的有 185 個套件（webpack 5.74 MB、@types/node 2.38 MB、caniuse-lite 2.23 MB、lodash、ajv…），**實測可省 21.5 MB／約 5,900 檔**。**執行程序見表格下方「P2-10 執行程序」**，動工前務必逐條看過——含事前基準取樣、Windows 檔案鎖定、兩層退路與版本漂移的處理 |
| P2-11 | 清掉前後端的無用相依 | ✅ | 2026-07-29 | 已移除下列宣告，實體已隨 P2-10 重裝從磁碟消失（實查 `mssql`／`sqlite3`／`chart.js`／`vue3-dropzone`／`typescript`／`ts-loader`／`express-fileupload` 皆已不存在）。**唯一例外是 `moment`**——它是 `sequelize` 的間接相依（sequelize → moment-timezone → moment），移除直接宣告仍然正確（server 程式碼確實沒 require 它），但省不到空間。後端刪 `webpack`＋`webpack-cli`（連同死設定檔 `server/webpack.config.js` 與 2025-06 舊打包殘留 `server/dist/`）、`sqlite3`、`mssql`、`moment`、`form-data`、`express-fileupload`、`stream`／`url`／`path`／`fs`；`tedious` 保留（Sequelize 的 mssql driver 是動態載入，grep 查不到 require 但不可刪）。前端刪 `chart.js`、`vue3-dropzone`（`@kurkle` 是 chart.js 的間接相依，本來就沒宣告，不必處理）。**驗證**：只改 package.json、webpack.config.js 不動的情況下重 build，產出與基準位元組完全相同（54 檔／18,170,563 bytes），證明這些套件從未被打包。以下為原始盤點依據——**後端**：2026-07-29 盤點 `server/` 全部 `require()`（排除 `node_modules`、`dist`）後，以下宣告在 package.json 卻從未被 require：`webpack`＋`webpack-cli`（devDep，7.9 MB；`server/webpack.config.js` 也是死設定，`start`/`dev` 都直接跑 `app.js`，`server/dist/server.js` 是 2025-06 的舊打包殘留）、`sqlite3`（5.3 MB 原生模組，專案只用 MS SQL）、`mssql`（4.8 MB，Sequelize 走 `tedious`，`tedious` 必須保留）、`moment`（已有 dayjs）、`form-data`、`express-fileupload`（實際在用的是 `multer`，這兩個功能重疊）、`stream`／`url`／`path`／`fs`（後兩者是 npm 上的佔位套件，Node 內建模組優先解析所以無害，但純屬垃圾）。合計約 20 MB。**前端**：`chart.js`（6.1 MB）＋`@kurkle` 全專案 0 處引用，所有圖表都走 echarts；`vue3-dropzone` 也 0 處引用。與 P2-4 的 typescript（22.9 MB）＋ts-loader 一併清掉，前端可省約 29 MB |
| P2-12 | `cors` 從 devDependencies 移到 dependencies | ✅ | 2026-07-29 | 採「移到 dependencies」而非刪除——`app.js` 的 `require` 是活的，移宣告零執行期風險。以下為原始問題描述：`server/app.js:5` 的 `const cors = require('cors')` 是活的程式碼（只有 `app.use(cors())` 被註解掉），但 `cors` 宣告在 `server/package.json` 的 devDependencies。目前開發機全裝所以沒事，一旦以 `npm ci --omit=dev`／`npm install --production` 部署，server 會在啟動第 5 行就 MODULE_NOT_FOUND。兩種修法擇一：移到 dependencies，或確定不用 CORS 就連 require 一起刪 |
| **P3 使用者可見的改善（成本低）** |||||
| P3-1 | 通用工具 CSS 集中 | ✅ | 2026-07-21 | 集中於 `assets/style.css`，詳見開發注意事項 |
| P3-2 | 導覽列高亮目前分區 | ⬜ | | 加 `router-link-active` |
| P3-3 | PM02 option-card 顏色改由 `route.path` 推導 | ⬜ | | 棄手動塗色，`sel.hist.link` 可省 |
| **P4 內部品質（中期，成本中）** |||||
| P4-1 | 統一 error handler middleware | ⬜ | | Express 5 原生支援 async handler 拋錯，可去除各 ctrl 重複 try/catch |
| P4-2 | HTTP 狀態碼修正、回應改 JSON | ⬜ | | 驗證失敗 400、DB 錯誤 500（現在一律 404）；現在回純文字 `'created'`/`'updated'` |
| P4-3 | 前端共用 axios instance + interceptor | ⬜ | | 統一錯誤與 loading；不抽象化各 service 的 CRUD 結構，只換掉裸 axios |
| P4-4 | REST 慣例調整 | ⬜ | | 資源 ID 進 URL（`PUT /api/orderitems/:id`，現在主鍵放 body）；`/getby`、`/removeall` 動詞端點檢討 |
| **P5 長期（不急，累積到適當時機一次做）** |||||
| P5-1 | hash 靜態檔給 `max-age=31536000, immutable` | ⬜ | | 免去每次開頁 40 幾個 304 往返；須依檔名 pattern 分流，`pic/` 是原名複製沒有 hash，一起吃長快取會導致換圖無效 |
| P5-2 | 兩套圖表庫收斂為一套 | ⬜ | | ECharts / D3（Chart.js 已於 2026-07-29 隨 P2-11 移除，本來就 0 處引用）|
| P5-3 | Webpack 遷移 Vite | ⬜ | | Vue 生態現行標配，值得但不急 |
| P5-4 | 建立 schema.sql 或 migration | ⬜ | | 作為資料庫 schema 唯一真相來源；models 宣告名實不符，只剩欄位註解價值 |
| P5-5 | team/group/member 的 defineExpose 改 v-model | ⬜ | | 值住在子元件內，父層靠 `defineExpose` + `ref` 從外面改子元件內部變數（`refGroup.value.sGroup = 'ME'`）。副作用：父層讀值要反向鑽（`refGroup.value.sGroup`）；子元件未掛載就賦值會炸（`team` 因 `v-if` 需加 `if (refTeam.value)` 防呆，PS01 索性改 `v-show` 硬渲染）；賦值不觸發 `onChange`，設值後要手動補呼叫處理函式；整個子元件實例被當 prop 傳給 `cbxmember`。改法：子元件改 `defineModel()`、父層 `<group v-model="sGroup" :param="groupList" />`，狀態回歸父層，`defineExpose` 與 `ref="refGroup"` 可拿掉（`@onChange` 保留，有些邏輯是值變了去打 API）。涉及 3 元件 + 5 個 view（PM01/PS01/PS02/PS03/PR01），需逐頁回歸測試，故列 P5 |
| P5-6 | char 欄位尾端空白改在 SQL 端 rtrim | ⬜ | | 棄前端 trimJSON |
| P5-7 | controller 錯誤處理修正 | ⬜ | | `if (rows)` 永遠 true、create 失敗誤回 404 |
| P5-8 | body-parser 改 express 內建 | ⬜ | | |
| P5-9 | `d:\DOC\` 路徑移至 .env | ⬜ | | |
| P5-10 | 清 package_bak.json 與大量註解死碼 | ⬜ | | |
| P5-11 | 密碼欄位未驗證卻顯示（誤導） | ⬜ | | 與 P1-1 一起處理較合適 |
| P5-12 | 移除孤兒 API route（equip、equiptype） | ⬜ | | 前端無 service 或 service 無人 import |
| P5-13 | joblist 無參數會產生壞 SQL | ⬜ | | 條件全空時組出 `where  and b.status...`；前端目前都會帶參數所以沒踩到 |
| P5-14 | getBy 收到物件型態參數會 500 | ⬜ | | `?key[sub]=x` 會讓 val 變物件，bind 參數炸掉；應在白名單檢查時一併擋掉非字串值 |
| P5-15 | PD05 新增購案的 `neworder` 從不重置 | ⬜ | | 開啟對話框只做 `addOrdersDlg = true`，欄位沿用上一筆的值（2026-07-28 實測確認）；`y6tserialno` 因 `addOrders` 無條件覆寫而無影響，但其他欄位可能被誤存 |

### P2-10 執行程序與執行記錄

**已於 2026-07-29 執行完畢**，以下程序保留作為日後重裝 `node_modules` 的標準作業（實際結果見本節末的「執行記錄」）。重裝會一次動到數萬個檔案且必然伴隨版本漂移，動工前逐條確認。

**前置（做完才能開始）**

1. **停掉所有佔用檔案的行程**——`npm start` 的 server、`npm run dev` 的 dev server、開著 `node_modules` 的編輯器索引。Windows 會鎖定執行中的檔案，沒停乾淨的話刪除會中途失敗、留下半殘的樹（`netstat -ano | findstr ":80 "` 確認 port 80／8080 都沒人監聽）。
2. **取驗證基準**——先跑一次 `npm run build`，把 `client/dist` 的檔名清單與各檔位元組數存下來（`Get-ChildItem client\dist -Recurse -File | Select-Object Name, Length | Export-Csv`）。**沒有這份基準，步驟 8 的比對就無從做起**；注意 `npm run dev` 會清空 `dist`，取完基準到驗證之間不可跑 dev。
3. **P2-8 已於 2026-07-29 完成**——根層 lock（commit 當下確定能跑的那份）已進版控，子層兩份殘留 lock 已刪除。這是步驟 13 第一層退路的依據；動工前用 `git ls-files package-lock.json` 再確認一次它真的在版控裡。
4. **P2-11／P2-12／P2-4 已於 2026-07-29 完成**——三份 `package.json` 的宣告都已清理完畢（後端少 11 個、前端少 4 個），重裝時會直接反映，不必裝完再刪再裝。注意 P2-11 只動宣告，**那些套件的實體現在還躺在 `node_modules` 裡**，要等這一步重裝才會真的消失，所以省下的空間會比先前估的 21.5 MB 多（後端約 20 MB、前端約 29 MB）。

**執行**

5. **實體備份**所有 `node_modules` 與 `package-lock.json` 到 `pi/` 外面（如 `D:\work\project\claude\pi-nm-backup`，不在 repo 內）：`robocopy <來源> <目的> /MIR /XJ /NFL /NDL /NJH /NJS`。**`/XJ` 不可省**，否則會鑽進 `piapp`／`piserv` 兩個 junction 把 client、server 各再複製一遍（就是把根目錄誤量成 421 MB 的那個陷阱）。
6. **刪掉三個 `node_modules` 與 `package-lock.json`**——**三個 `package.json` 全部保留**。這一步只改套件實體的擺放位置，不動任何宣告；實體被 hoist 到根不代表子層宣告可以省，否則變成 phantom dependency（見開發注意事項）。

   **⚠ 刪除順序不可顛倒**：根 `node_modules` 裡的 `piapp`／`piserv` 是指向 `client/`／`server/` 的 junction，**PowerShell 5.1 的 `Remove-Item -Recurse` 有機會穿過 junction 把整個前後端原始碼刪掉**。務必先用 `cmd /c rmdir "<path>\node_modules\piapp"`（不加 `/s`，只移除連結本身）拆掉兩個 junction，確認 `client/src`、`server/` 檔數沒變，再刪本體。刪本體用 `cmd /c rd /s /q`（不跟隨 reparse point，且比 `Remove-Item` 快很多——實測 5 萬個檔 5.5 秒）。
7. **從根跑 `npm install`**（不可 `cd client`）。實測 scratchpad 同構安裝耗時 7 分鐘，產出單一份 378.4 MB／44,653 檔，`client/`／`server/` 底下不再有 `node_modules`；126 筆版本衝突以巢狀形式收在根 `node_modules` 內各套件目錄下，那才是子層 `node_modules` 唯一的正當存在理由。

**驗證（缺一不可）**

8. `npm run build` 後與步驟 2 的基準比對——檔名（含 contenthash）與位元組數全部一致才算真的沒壞，手法同 P2-3。
9. `npm start` 起 server，並**實際打幾支 API**（如 `/api/basic/`、`/api/orders/`）確認 Sequelize + tedious 連得到 DB。版本漂移風險最高的就是這一段（`tedious`／`sqlite3` 帶原生或半原生相依），只確認「server 起得來」不夠——連線失敗要送出查詢才會現形。
10. 瀏覽器實跑重點頁面：PD05 請購管理（表格編輯、序號產生）、PDF 匯出、PS01 圖表。
11. 先看 `git diff package-lock.json`，挑出跨大版號的套件重點驗證（實測 337 個漂移中 `@ctrl/tinycolor` 從 3.6.1 跳到 4.2.0）。

**收尾**

12. 全部通過才 `git add package-lock.json` 提交新 lock，並刪除步驟 5 的備份。
13. 不通過則退回，**退路分兩層**：
    - **第一層** `git checkout package-lock.json client/package.json server/package.json` ＋ `npm ci`。靠的是 P2-8 committed 的那份 lock 記著未 hoist 的擺放位置，會原樣重現。**三個 `package.json` 必須跟 lock 一起還原**——`npm ci` 會先檢查兩者是否同步，只還原 lock 會因為 package.json 已經少了 15 個宣告而直接拒絕執行。失效情境：套件被下架／撤版、斷網、`sqlite3` 這類原生模組要重抓 prebuilt binary。另外 `npm ci` 在 workspaces 根目錄是否會連子層 `node_modules` 一併清乾淨再重建，**尚未實測**。
    - **第二層** 把步驟 5 的備份 robocopy 回去。還原後兩個 junction 因 `/XJ` 不在備份中，補跑一次 `npm install` 讓 npm 重建連結。這層不依賴 registry、網路與 npm 行為，是真正的保險。

**兩點提醒**

- 版本漂移**無法靠保留舊 lock 迴避**——舊 lock 記的正是未 hoist 的擺放位置，`npm ci` 只會把它原樣重現。只能靠退路與驗證控管。
- `npm dedupe` 理論上能在不刪 lock 的情況下把重複往上提、可能繞開部分漂移，但**未在本專案實測過**。2026-07-29 直接走了重裝這條路，所以這個問題仍然沒有答案。

**執行記錄（2026-07-29）**

| 項目 | 結果 |
|---|---|
| 備份 | `D:\work\project\claude\pi-nm-backup\{root-nm,client-nm,server-nm}` ＋ lock，50,565 檔／391.6 MB，與盤點數字吻合（robocopy 加了 `/MT:16` 加速） |
| 刪除 | 先 `rmdir` 拆兩個 junction 並確認 `client/src` 106 檔、`server` 98 檔未動，再 `rd /s /q`，全程 5.5 秒 |
| 安裝 | `npm install --no-audit --no-fund` **42 秒**（npm cache 是熱的；scratchpad 冷 cache 那次要 7 分鐘），added 776 packages |
| 結果 | 42,701 檔／326.0 MB，單一 `node_modules`，junction 自動重建 |
| 版本漂移 | lock 內套件 720 → 665 種；移除 85、新增 30、版本變動 187，其中**跨大版號 45 個**。碰到執行期的是 `@ctrl/tinycolor` 3.6.1→4.2.0、`@vueuse/core` 9.13.0→14.3.0（皆 Element Plus 相依）、`proxy-from-env` 1→2（axios）、`entities` 4.5.0→7.0.1（Vue compiler）、`tedious` 18.6.1→18.6.2 ＋ `@azure/msal-*` 大跳。`selfsigned`、`@jsonjoy.com/*`、`@types/node` 只在 dev／型別 |
| 驗證 8 build | 54 檔／18,170,566 → 18,238,327 bytes（+0.37%）。**位元組比對在此步不適用**——webpack 自己從 5.105.4 跳到 5.109.2，產出本來就會變；改以下三項功能驗證為準 |
| 驗證 9 API | `/api/basic/`、`/api/orders/`、`/api/employee/`、`/api/taskcategory/`、`/api/ugroup/` 全 200，**回應位元組數與重裝前完全相同**（1,937,659／5,997,713／53,402／557），tedious 18.6.2 輸出一致 |
| 驗證 10 瀏覽器 | 登入 → PM01 看板 → PM02/PD05 進度表 → PS01 KPI（表格＋ECharts 甜甜圈圖）→ PD05「工程月報」PDF 匯出（345,958 bytes，`%PDF-1.3` 檔頭、`%%EOF` 檔尾、NotoSansTC 中文正常）。**全程 console 0 errors 0 warnings**，Element Plus 的 tabs／radio group／日期選擇器／對話框／checkbox 渲染皆正常，tinycolor 4.x 與 vueuse 14.x 未造成視覺破壞 |
| 收尾 | 新 lock 已提交；備份 `pi-nm-backup` **暫時保留**，觀察數日確認無異常再刪 |

**這次執行對原程序的兩處修正**（已直接寫回上面的步驟）：

1. 步驟 6 原本只寫「刪掉三個 `node_modules`」，沒提 junction 的致命風險——`Remove-Item -Recurse` 可能穿過 `piapp`／`piserv` 刪掉原始碼。已補上「先 `rmdir` 拆 junction、再 `rd /s /q`」的順序。
2. 步驟 13 第一層退路原本只還原 lock，但 P2-11／P2-12／P2-4 改過 `package.json` 之後，`npm ci` 會先檢查兩者同步、直接拒絕執行。已改為三個 `package.json` 連同 lock 一起 `git checkout`。
