# Copilot Instructions（前端專案規範）

請嚴格遵守以下規則。

## 技術限制
- 這是純前端專案，只能使用 HTML、CSS、原生 JavaScript。
- 禁止引入任何框架或套件；不要建立 `package.json`；不要執行 `npm install`。
- 不要引用任何外部 CDN，程式必須可離線運作。
- 檔案結構固定為根目錄的：
  - `index.html`
  - `styles.css`
  - `app.js`

## 程式風格
- 註解一律使用繁體中文。
- 變數與函式命名一律使用英文 `camelCase`。
- CSS 顏色一律使用 `:root` 定義的 CSS 變數，不可寫死色碼。
- JavaScript 一律使用 `const` / `let`，禁止使用 `var`。
- 產生 DOM 內容時，必須使用 `textContent` 或 `createElement`，禁止使用 `innerHTML` 組字串。

## 協作方式
- 動手修改前，先條列說明預計修改的檔案與變動內容，待我確認後才開始。
- 一次只處理一件事，不要額外進行未要求的重構。
- 修改完成後，需提供在瀏覽器中的驗證步驟。
