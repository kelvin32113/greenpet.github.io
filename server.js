const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
// 如果前端與後端同 origin，可以移除 cors，保留也沒問題
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) {
  console.warn('Warning: GEMINI_API_KEY not set in environment. Please set it in a .env file or environment variables.');
}

// 提供專案根目錄作為靜態檔案來源，啟動後可在 http://localhost:PORT/ 直接開啟 index.html
app.use(express.static(path.join(__dirname)));

// Proxy endpoint: 前端送 { path, payload }，伺服器以環境變數的 API key 呼叫 Google Generative Language API
app.post('/api/gemini', async (req, res) => {
  const { path: apiPath, payload } = req.body;
  if (!apiPath || !payload) return res.status(400).json({ error: '請提供 path 與 payload' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY 尚未設定於伺服器' });

  const url = `https://generativelanguage.googleapis.com/${apiPath}?key=${apiKey}`;
  try {
    const response = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 });
    res.json(response.data);
  } catch (err) {
    console.error('Gemini proxy error:', err.response?.data || err.message);
    res.status(500).json({ error: 'proxy failed', detail: err.response?.data || err.message });
  }
});

// SPA catch-all: 若找不到靜態資源，將所有 GET 請求導到 index.html（方便 SPA 前端路由）
app.get('*', (req, res, next) => {
  // 如果請求以 /api/ 開頭，交給下一個 middleware（避免攔截 API）
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port} (serving static files and /api/gemini)`));
