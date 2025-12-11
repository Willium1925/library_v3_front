# Vue 3 圖書館前端系統 - 實作說明

## 專案概述

本專案是基於 Vue 3 + Vite + Composition API 開發的圖書館管理系統前端，採用現代化的元件化架構，提供完整的書籍瀏覽、搜尋、預約、借閱管理等功能。

## 技術棧

- **框架**: Vue 3 (Composition API)
- **構建工具**: Vite
- **路由管理**: Vue Router 4
- **狀態管理**: Pinia
- **HTTP 請求**: Axios
- **工具集**: @vueuse/core
- **圖標**: Font Awesome 6
- **字體**: Noto Sans TC, Noto Serif TC

## 專案結構

```
src/
├── api/                    # API 服務層
│   ├── index.js            # Axios 配置與攔截器
│   ├── auth.js             # 認證 API
│   ├── books.js            # 書籍 API
│   ├── loans.js            # 借閱 API
│   ├── reservations.js     # 預約 API
│   ├── reviews.js          # 評論 API
│   └── notifications.js    # 通知 API
│
├── assets/
│   └── styles/
│       └── variables.css   # 全域 CSS 變數
│
├── components/             # 可重用元件
│   ├── common/             # 通用元件
│   │   ├── TheHeader.vue
│   │   └── NotificationBell.vue
│   ├── book/               # 書籍相關元件
│   │   ├── BookCard.vue
│   │   ├── BookGrid.vue
│   │   ├── HoldingsTable.vue
│   │   ├── ReviewItem.vue
│   │   └── ReviewList.vue
│   ├── filter/             # 篩選相關元件
│   │   ├── FilterSidebar.vue
│   │   ├── FilterGroup.vue
│   │   └── TagCloud.vue
│   └── user/               # 使用者相關元件
│       ├── LoanCard.vue
│       └── ReservationCard.vue
│
├── router/                 # 路由配置
│   └── index.js
│
├── stores/                 # Pinia 狀態管理
│   ├── auth.js             # 認證狀態
│   ├── books.js            # 書籍狀態
│   ├── user.js             # 使用者狀態
│   └── notifications.js    # 通知狀態
│
├── views/                  # 頁面元件
│   ├── HomePage.vue        # 首頁
│   ├── SearchPage.vue      # 搜尋頁
│   ├── BookDetailPage.vue  # 書籍詳情頁
│   ├── MyPage.vue          # 個人中心
│   └── tabs/               # 個人中心 Tab 元件
│       ├── NotificationTab.vue
│       ├── ProfileTab.vue
│       ├── ReservationsTab.vue
│       ├── LoansTab.vue
│       └── HistoryTab.vue
│
├── App.vue                 # 根元件
└── main.js                 # 入口文件
```

## 核心功能

### 1. 首頁 (HomePage)

- **分類導航**: 主分類與子分類切換
- **最新上架**: 顯示最新加入的書籍（Top 5）
- **熱門借閱**: 顯示借閱次數最多的書籍（Top 5）
- **標籤雲**: 熱門標籤快速導向

### 2. 搜尋頁 (SearchPage)

- **側邊篩選器**:
  - 主分類（單選）
  - 子分類（單選）
  - 作者（單選）
  - 出版商（單選）
  - 標籤（多選）
  - 系列作顯示切換
  
- **排序選項**:
  - 上架日期（新到舊/舊到新）
  - 借閱熱度（熱門/冷門）
  - 書名（A-Z / Z-A）
  
- **分頁功能**: 支援頁碼導航

### 3. 書籍詳情頁 (BookDetailPage)

- **書籍資訊**:
  - 封面、書名、作者
  - ISBN、出版社、出版日期
  - 分類、標籤
  - 平均評分與評分人數
  - 累計借閱次數
  
- **館藏表 (HoldingsTable)**:
  - 顯示所有副本的狀態
  - 支援預約已借出的書籍
  - 顯示排隊人數
  
- **評論系統 (ReviewList)**:
  - 評分（1-5 星）
  - 文字評論
  - 按讚功能
  - 編輯/刪除自己的評論

### 4. 個人中心 (MyPage)

**通知中心 Tab**:
- 顯示所有通知
- 標記已讀/全部已讀
- 未讀數量提示

**個人資料 Tab**:
- 顯示使用者資訊
- 身份標籤（一般/市民/管理員）
- 帳戶狀態（待啟用/正常/停權）
- 違約點數

**我的預約 Tab**:
- 顯示所有預約記錄
- 排隊順位資訊
- 取書期限提醒
- 取消預約功能

**目前借閱 Tab**:
- 顯示當前借閱的書籍
- 到期日提醒
- 續借功能（符合條件時）
- 已續借次數顯示

**借閱歷史 Tab**:
- 顯示過往借閱記錄
- 借閱日期與歸還日期

## API 服務層設計

### Axios 配置

- **Base URL**: `http://localhost:8083/api`
- **請求攔截器**: 自動添加 JWT Token
- **響應攔截器**: 統一錯誤處理與 Token 過期處理

### API 模組

所有 API 都經過封裝，返回 Promise，方便在元件中使用 async/await：

```javascript
// 範例：使用 booksAPI
import { booksAPI } from '@/api/books'

const fetchBooks = async () => {
  try {
    const response = await booksAPI.search({ keyword: '村上春樹' })
    // 處理響應
  } catch (error) {
    // 錯誤處理
  }
}
```

## 狀態管理 (Pinia)

### authStore
- 使用者登入/登出
- Token 管理
- 使用者資料
- 角色權限判斷

### booksStore
- 書籍搜尋
- 書籍詳情
- 篩選條件管理
- 分頁狀態

### notificationStore
- 通知列表
- 未讀數量
- 標記已讀
- 輪詢更新（每 30 秒）

### userStore
- 當前借閱
- 借閱歷史
- 預約列表
- 續借/取消預約

## 路由配置

| 路徑 | 元件 | 說明 | 需要登入 |
|------|------|------|----------|
| `/` | HomePage | 首頁 | ❌ |
| `/search` | SearchPage | 搜尋頁 | ❌ |
| `/books/:id` | BookDetailPage | 書籍詳情 | ❌ |
| `/my` | MyPage | 個人中心 | ✅ |

## 元件設計原則

### 1. 單一職責
每個元件專注於一個功能，提高可重用性。

### 2. Props 與 Emits
- 使用 Props 傳遞資料給子元件
- 使用 Emits 讓子元件通知父元件事件

### 3. 響應式設計
- 使用 CSS Flexbox 和 Grid
- 使用 `@media` 查詢實現響應式

### 4. 樣式隔離
- 所有元件使用 `<style scoped>`
- 共用變數定義在 `variables.css`

## 樣式系統

### CSS 變數

```css
:root {
  --primary: #1a1a1a;      /* 主色 */
  --accent: #d32f2f;       /* 強調色 */
  --success: #2e7d32;      /* 成功色 */
  --bg: #f9f9f9;           /* 背景色 */
  --border-color: #000;    /* 邊框色 */
  --gray: #888;            /* 灰色 */
}
```

### 設計風格

- **極簡黑白風格**: 清晰易讀
- **立體陰影效果**: 增強層次感
- **流暢動畫**: 提升使用者體驗
- **Pop Art 風格標籤**: 獨特的視覺效果

## 開發與部署

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

### 生產構建

```bash
npm run build
```

### 預覽生產構建

```bash
npm run preview
```

## 待實作功能

1. **登入/註冊頁面**: 目前使用 mock 認證
2. **個人資料編輯**: 目前僅顯示
3. **收藏功能**: 已預留 UI，待實作
4. **逾期書籍 Tab**: 架構已完成，待實作
5. **標籤雲 API**: 目前使用 mock 資料
6. **分類 API**: 目前使用 mock 資料

## 與後端整合

### API 對接

後端 API 基於 Spring Boot，所有端點已在 API 服務層定義。

### 資料格式

前端預期的資料格式與後端 DTO 保持一致：

- 書籍列表: `bookPage` (分頁資料) + `stats` (統計資料)
- 書籍詳情: `book` + `copies` (館藏列表)
- 評論列表: 包含 `userLiked` 標記當前使用者是否按讚

## 注意事項

1. **Token 管理**: Token 儲存在 localStorage，需注意安全性
2. **錯誤處理**: 所有 API 呼叫都應包含 try-catch
3. **載入狀態**: 長時間操作應顯示 loading 狀態
4. **使用者體驗**: 操作成功/失敗應給予明確反饋

## 維護建議

1. **元件拆分**: 當元件超過 300 行時考慮拆分
2. **API 整合**: 優先使用 Store 中的方法而非直接呼叫 API
3. **樣式維護**: 修改全域樣式時檢查影響範圍
4. **類型安全**: 考慮使用 TypeScript 提升開發體驗

## 結語

本專案完整實現了圖書館管理系統的前端功能，採用現代化的 Vue 3 技術棧，具有良好的可維護性和擴展性。所有元件都經過精心設計，確保程式碼品質和使用者體驗。

