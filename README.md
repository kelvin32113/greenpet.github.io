# Gemini API Key 隱藏與 proxy 使用說明

這個專案包含前端（`index.html`）和一個簡單的 Node/Express 代理伺服器 `server.js`，用來把對 Google Generative Language / Gemini 的請求由後端代發，避免在前端硬編碼或暴露 API Key。

主要變更
- `index.html`：移除前端直接包含的 API key；改為呼叫 `/api/gemini`（POST），payload 範例：{ path: 'v1beta/models/gemini-...:generateContent', payload: {...} }
- 新增 `server.js`：從 environment 變數 `GEMINI_API_KEY` 讀取 key，並將請求轉送到 Generative Language API。

快速上手（本機開發）
1. 安裝依賴

```bash
npm install
```

2. 建立 `.env`（或使用系統環境變數）

```bash
cp .env.example .env
# 編輯 .env，填入 GEMINI_API_KEY
```

3. 啟動伺服器

```bash
npm run start
# 或開發時使用 hot-reload
npm run dev
```

4. 在瀏覽器中開啟你的 `index.html`（推薦搭配本機靜態伺服器或把前端也由 Express 提供），前端會向 `http://localhost:3000/api/gemini` 發送請求，再由伺服器轉送至 Gemini API。

安全注意事項
- 不要將 `.env` 或實際的 API key 提交到版本控制系統。 `.gitignore` 已包含 `.env`。
- 若要部署到生產環境，請把 `GEMINI_API_KEY` 設為你的部署平台（如 Heroku、Vercel serverless secret 或其他）所提供的環境變數機制。

如果你要我也幫你把前端改為由 Express 伺服器直接提供靜態檔案（或整合為同一個啟動腳本），我可以繼續修改。
