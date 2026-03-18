# PI - 工程專案管理系統

針對工程設計組織開發的**全端專案管理系統**，涵蓋專案管理、團隊協作、採購追蹤、設計進度管理與 KPI 報表。使用 **Vue 3** + **Express.js** + **MS SQL Server** 建構。

## 功能特色

- 專案建立、編輯與生命週期追蹤（暫停/恢復）
- 多學科設計工作管理（ID、BD、DD、CNT、DCS、PLC、BUY、CON、COM、RPT）
- 設計進度追蹤（預估 vs 實際）
- 組別與團隊管理、專案負責人與組員指派（含權重分配）
- 多階段採購追蹤（預估 → 購案 → 訂單 → 交貨 → 驗收）
- 週報/月報（二層、三層結構）
- KPI 績效追蹤與加班統計
- 多格式匯出（PDF、Excel、Word）
- ISO 文件與圖號管理

## 技術架構

### 後端（server/）

| 項目 | 技術 |
|------|------|
| 框架 | Express.js v5.1.0 |
| ORM | Sequelize v6.37.7 |
| 資料庫 | MS SQL Server 2017（via tedious） |
| 文件產出 | exceljs、docx |
| 檔案上傳 | express-fileupload、multer |

### 前端（client/）

| 項目 | 技術 |
|------|------|
| 框架 | Vue.js v3.5.13（Composition API） |
| 狀態管理 | Pinia v3.0.3 + Vuex v4.1.0 |
| 路由 | Vue Router v4.6.3（Lazy Loading） |
| UI 元件庫 | Element Plus v2.11.5 |
| 圖表 | ECharts v6.0.0、Chart.js v4.5.1、D3.js v7.9.0 |
| PDF 匯出 | jsPDF（含繁體中文字型 NotoSansTC） |
| HTTP 客戶端 | Axios v1.12.2 |
| 語言 | TypeScript v5.9.3 + JavaScript |

## 專案結構

```
pi/
├── package.json                     # npm workspaces root (client, server)
├── client/                          # 前端 Vue 3 SPA
│   ├── src/
│   │   ├── index.js                 # 應用程式進入點
│   │   ├── App.vue                  # 根元件（Header + Router Outlet）
│   │   ├── router/index.js          # Vue Router 路由設定
│   │   ├── stores/                  # Pinia 狀態管理
│   │   ├── service/                 # 32 個 Axios API 服務
│   │   ├── components/              # 25 個可重用元件
│   │   ├── views/                   # 40+ 頁面級元件
│   │   ├── util/                    # 工具函式庫
│   │   ├── controller/              # 狀態機控制器（FSM）
│   │   └── assets/                  # 靜態資源（CSS、字型）
│   ├── dist/                        # Webpack 打包輸出
│   └── webpack.config.js
├── server/                          # 後端 Express.js API
│   ├── app.js                       # Express 主程式（Port 80）
│   ├── routes.js                    # 路由定義
│   ├── ctrl/                        # 32 個控制器
│   ├── models/                      # 27 個資料模型（Sequelize）
│   └── .env                         # DB 環境變數（不進版控）
```

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定資料庫連線

複製 `server/.env.example` 為 `server/.env`，填入 MS SQL Server 連線資訊：

```
DB_HOST=your_host
DB_PORT=1433
DB_NAME=ProjectDB
DB_USER=your_user
DB_PASSWORD=your_password
```

### 3. 開發模式

```bash
npm run dev
```

同時啟動後端（nodemon, Port 80）與前端（webpack-dev-server, Port 8080）。
前端透過 webpack proxy 將 `/api` 請求轉發至後端。

### 4. 編譯前端

```bash
npm run build
```

Webpack 生產建置輸出至 `client/dist/`。

### 5. 啟動伺服器

```bash
npm start
```

Express 靜態服務 `client/dist/` 作為前端入口，API 掛載於 `/api/*`。

## 伺服器環境需求

- OS: Windows Server 2019
- DB: SQL Server 2017
- Node.js: v22+
- 安裝 Microsoft OLE DB Driver 19 for SQL Server
- SQL Server 需啟用 TCP/IP 通訊協定

## API 端點

標準 CRUD 端點：

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | /api/{resource}/ | 取得全部 |
| GET | /api/{resource}/getby | 條件查詢 |
| POST | /api/{resource}/ | 新增 |
| PUT | /api/{resource}/ | 更新 |
| DELETE | /api/{resource}/ | 刪除 |

### 特殊報表端點（Common Controller）

| 端點 | 功能 |
|------|------|
| getKPIByUser | 個人設計績效指標 |
| getPrjinprogress | 組別進行中專案 |
| getPersonalJobs | 員工專案歷程 |
| getPurchaseEsti / getPurchase | 預估 vs 實際採購金額 |
| getOrderEsti / getOrder | 預估 vs 實際訂單金額 |
| getDeliveryEsti / getDelivery | 預估 vs 實際交貨金額 |
| getReceiveCheckEsti / getReceiveCheck | 預估 vs 實際驗收金額 |
| getOTSumByTeam / getOTSumByUser | 加班統計（組別/個人） |

## 頁面路由對照

| 路由代碼 | 功能說明 |
|----------|----------|
| `/` | 首頁 |
| `/overview` | 專案流程總覽 |
| `/document` | 設計標準與公安文件 |
| **UA01~02** | 登入/登出、帳號編輯 |
| **PF01~04** | 專案執行/委外/長約/採購流程 |
| **PM01** | 專案列表（全部/組別） |
| **PM02** | 專案資料管理（子頁 PD01~PD06） |
| **PM03~05** | 專案搜尋、統計、報表 |
| **PQ01~03** | 專案查詢、訂單查詢、設計文件查詢 |
| **PR01~04** | 三級/二級 週報、三級/二級 月報 |
| **PS01~03** | KPI 與統計分析 |
| **ED01~02** | 設計標準、公安文件 |

## 學科代碼

| 代碼 | 含義 |
|------|------|
| ID | 儀器設計（Instrument Design） |
| BD | 基本設計（Basic Design） |
| DD | 細部設計（Detail Design） |
| CNT | 控制（Control） |
| DCS | 分散式控制系統 |
| PLC | 可程式邏輯控制器 |
| BUY | 採購 |
| CON | 施工（Construction） |
| COM | 試車（Commissioning） |
| RPT | 報告（Report） |

## 部署

### pm2 部署

```bash
pm2 start --name piapp app.js --watch
pm2 stop piapp
pm2 delete piapp
pm2 list
pm2 monit
```

### jsPDF 繁體中文字型設定

1. 至 [Google Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+TC) 下載 NotoSansTC
2. 使用 jsPDF fontconverter 轉換為 .js 檔
3. 前端引入：`import '@/assets/NotoSansTC-normal.js'`
