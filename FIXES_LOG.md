# 前端修正日誌

## 2025-12-11 修正項目

### 1. 首頁（HomePage.vue）修正

#### 問題：
- 主分類、子分類使用假資料
- 最新上架、熱門借閱不會根據主分類改變
- 書籍卡片點擊無法導航

#### 修正：
✅ **新增 Categories API**
- 創建 `src/api/categories.js`
- `getAll()` - 獲取所有主分類（`/api/categories`）
- `getAllSubs()` - 獲取所有子分類（`/api/categorySubs`）

✅ **更新 HomePage.vue**
- 使用 `categoriesAPI` 從後端獲取真實分類資料
- 移除 mock 資料
- 實作主分類與子分類的動態關聯
  ```javascript
  const currentSubCategories = computed(() => {
    if (!selectedMainCategory.value) return []
    return allSubCategories.value.filter(
      sub => sub.categoryMainId === selectedMainCategory.value
    )
  })
  ```

✅ **實作分類選擇聯動**
- 使用 `watch` 監聽主分類變化
- 當主分類改變時，自動更新：
  - 最新上架書籍（傳入 categoryId）
  - 熱門借閱書籍（傳入 categoryId）
  - 子分類列表（自動篩選）

✅ **修正 API 呼叫**
- `fetchLatestBooks(categoryId)` - 支援分類參數
- `fetchPopularBooks(categoryId)` - 支援分類參數
- 對應後端 API：
  - `/api/books/home/top5new/{categoryId}`
  - `/api/books/home/top5loan/{categoryId}`

### 2. 書籍卡片（BookCard.vue）修正

#### 問題：
- 點擊書籍圖片無法導航到書籍詳情頁

#### 修正：
✅ **分離點擊區域**
- 移除整個卡片的點擊事件
- 為圖片和資訊區域分別添加點擊事件
  ```vue
  <div class="book-card__img-wrapper" @click="goToDetail">
  <div class="book-card__info" @click="goToDetail">
  ```

✅ **更新 CSS**
- 移除 `.book-card` 的 `cursor: pointer`
- 為可點擊區域添加 `cursor: pointer`

✅ **欄位映射修正**
- `book.imageUrl` - 書籍封面圖
- `book.authors` - 支援陣列格式的作者列表
- `book.publisherName` - 出版社名稱

### 3. 搜尋頁（SearchPage.vue）修正

#### 問題：
- 使用假資料
- 系列作顯示為 checkbox，應為按鈕切換
- 系列作顯示位置錯誤

#### 修正：
✅ **整合真實 API**
- 使用 `categoriesAPI` 獲取分類資料
- 使用 `booksStore.searchBooks()` 執行搜尋
- 移除所有 mock 資料

✅ **系列作顯示改版**
- 從 Checkbox 改為按鈕切換組
- 移動到 Toolbar 右側（排序旁邊）
- 新增按鈕樣式：
  ```vue
  <div class="series-display-toggle">
    <button :class="['toggle-btn', { active: !filters.seriesDisplay }]">
      全部書籍
    </button>
    <button :class="['toggle-btn', { active: filters.seriesDisplay }]">
      僅系列作
    </button>
  </div>
  ```

✅ **修正資料類型**
- `seriesDisplay` 從 `boolean` 改為 `number | null`
- `null` = 全部書籍
- `1` = 僅系列作
- 符合後端 API 期望的參數格式

✅ **移除 FilterSidebar 中的系列作選項**
- 從側邊欄移除 checkbox
- 相關邏輯移至 SearchPage 主頁面

### 4. 篩選側邊欄（FilterSidebar.vue）修正

#### 修正：
✅ **移除系列作顯示選項**
- 刪除 checkbox 相關 HTML
- 移除 `seriesDisplay` 相關狀態管理
- 更新 `hasActiveFilters` 計算邏輯
- 更新 `clearAllFilters` 方法

✅ **簡化狀態管理**
```javascript
const filters = reactive({
  mainCategoryId: null,
  subCategoryId: null,
  authorId: null,
  publisherId: null,
  tags: []
  // 移除 seriesDisplay
})
```

## API 對接清單

### 已完成
- ✅ `/api/categories` - 主分類列表
- ✅ `/api/categorySubs` - 子分類列表
- ✅ `/api/books/home/top5new/{categoryId}` - 最新上架（支援分類）
- ✅ `/api/books/home/top5loan/{categoryId}` - 熱門借閱（支援分類）
- ✅ `/api/books` - 書籍搜尋（含所有篩選參數）

### 待實作（後端 API）
- ⏳ 標籤列表 API
- ⏳ 作者列表 API（含書籍數量統計）
- ⏳ 出版社列表 API（含書籍數量統計）
- ⏳ 標籤根據分類篩選的 API

## 資料結構對應

### 主分類（CategoryMainDTO）
```javascript
{
  id: number,
  name: string
}
```

### 子分類（CategorySubDTO）
```javascript
{
  id: number,
  name: string,
  categoryMainId: number
}
```

### 書籍列表項目（BookListItemDTO）
```javascript
{
  id: number,
  title: string,
  authors: string[] | string,
  publisherName: string,
  imageUrl: string,
  availableCount: number,
  addedDate: string,
  totalLoanCount: number
}
```

## 測試建議

### 首頁測試
1. 檢查主分類是否正確載入
2. 點擊不同主分類，確認：
   - 子分類列表更新
   - 最新上架書籍更新
   - 熱門借閱書籍更新
3. 點擊書籍圖片/標題，確認導航正確

### 搜尋頁測試
1. 檢查分類篩選器是否正確載入
2. 測試系列作顯示切換按鈕
3. 測試排序功能
4. 測試分頁功能
5. 測試 URL 參數同步

## 已知限制

1. **標籤功能**: 目前標籤仍使用 mock 資料，待後端提供標籤 API
2. **作者/出版社篩選**: 篩選器中的作者和出版社列表為空，待後端提供列表 API
3. **統計數量**: 篩選選項中的書籍數量（count）暫未顯示，待後端提供統計資料

## 下一步

1. 實作標籤 API 整合
2. 實作作者/出版社列表 API
3. 優化搜尋結果的載入狀態
4. 新增搜尋無結果時的提示
5. 實作搜尋關鍵字高亮顯示

