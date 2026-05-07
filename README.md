# debug your life (原名 PositiveFlow)

這是一個整合「資訊工程」與「心理學」的網頁 Prototype，透過儀式感（Ritual）幫助使用者進入心流，並透過感恩日記（Gratitude）強化生活中的正向循環，達成「Debug Your Life」的核心目標。

## 專案特色

*   **儀式化心流 (Ritual Focus)**：透過 Checklist、呼吸引導（動畫縮放）與番茄鐘計時器，協助使用者排除干擾、專注當下。
*   **感恩紀錄 (Gratitude Journaling)**：引導記錄「今天的三件好事」，完成後提供視覺特效鼓勵，並可模擬輸出精美的 IG 分享卡片。
*   **成就與獎勵系統 (Rewards)**：
    *   專注 1 分鐘 = 5 XP，一篇感恩日記 = 30 XP。
    *   擁有完整的經驗值（XP）、等級（Level）及連續登入天數（Streak）機制。
*   **隱私與資料管理**：完全基於前端開發，資料安全地儲存於使用者的本機瀏覽器 (`localStorage`)，並支援將資料打包為 JSON 格式進行匯出與匯入。

## 技術框架

*   **前端框架**：[Vue 3](https://vuejs.org/) (Composition API / `<script setup>`)
*   **UI 組件庫**：[Vuetify 3](https://vuetifyjs.com/)
*   **建構工具**：[Vite](https://vitejs.dev/)
*   **視覺特效**：`canvas-confetti`

## 開發與執行

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

### 建立正式環境發布版本

```bash
npm run build
```

## 關於作者 / 貢獻

這是一個專注於個人成長與正向心理學的開源/實驗性質 Prototype，歡迎您體驗並一同「Debug Your Life」！
