# 個人網站

網址:https://mengchian.github.io/

## 檔案結構

```
portfolio/
├── index.html          # 主頁面
├── css/style.css        # 樣式
├── js/main.js            # 讀取 JSON 並渲染頁面內容的邏輯
├── data/
│   ├── profile.json     # 自傳、技能、經歷、聯絡方式
│   └── projects.json    # 作品集列表
└── README.md
```

## 如何更新內容(目前階段)

不用改 HTML/CSS/JS,只要編輯:

- `data/profile.json` — 姓名、職稱、自傳、技能、學經歷
- `data/projects.json` — 作品集(可新增/刪除物件來增減作品)

改完存檔、`git push` 上去,GitHub Pages 就會自動更新。


## 本機預覽

因為頁面用 `fetch()` 讀取 JSON,直接用瀏覽器打開 `index.html`(`file://`)在部分瀏覽器
(尤其 Chrome)會被 CORS 政策擋下,畫面會顯示「資料載入失敗」。請改用簡易本地伺服器預覽,例如:

```bash
cd portfolio
python3 -m http.server 8000
# 瀏覽器開啟 http://localhost:8000
```

部署到 GitHub Pages 後(透過 https 服務),就不會有這個問題。
