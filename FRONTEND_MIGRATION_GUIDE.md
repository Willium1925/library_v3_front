# 前端 API 調用遷移指南

## 📋 概述

後端已統一使用 `ApiResponse<T>` 包裝所有 API 回應，前端需要相應調整。

## 🔄 回應格式變化

### 舊格式（直接回傳資料）
```javascript
// 成功時
{
  "id": 1,
  "name": "張三",
  "email": "zhang@example.com"
}

// 失敗時（各種不同格式）
{
  "status": 404,
  "error": "Not Found",
  "message": "使用者不存在"
}
// 或
"錯誤訊息字串"
```

### 新格式（統一包裝）
```javascript
// 成功時
{
  "success": true,
  "message": "操作成功",  // 可選
  "data": {
    "id": 1,
    "name": "張三",
    "email": "zhang@example.com"
  },
  "timestamp": "2026-01-10T12:00:00"
}

// 失敗時
{
  "success": false,
  "message": "使用者不存在",
  "errorCode": "2001",
  "data": null,  // 或包含錯誤詳情
  "timestamp": "2026-01-10T12:00:00"
}
```

## 🛠️ 前端調整方案

### 方案 1: 全域攔截器（推薦）

#### `src/api/index.js`
```javascript
import axios from 'axios';
import { ElMessage } from 'element-plus'; // 或你使用的 UI 框架

// 創建 axios 實例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 請求攔截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 回應攔截器
api.interceptors.response.use(
  response => {
    const { data } = response;
    
    // 如果後端回應有 success 欄位（新格式）
    if (typeof data === 'object' && 'success' in data) {
      if (data.success) {
        // 成功：直接回傳 data 欄位
        return data.data;
      } else {
        // 失敗：拋出錯誤
        const error = new Error(data.message || '操作失敗');
        error.errorCode = data.errorCode;
        error.response = response;
        return Promise.reject(error);
      }
    }
    
    // 舊格式或其他格式：直接回傳
    return data;
  },
  error => {
    // HTTP 錯誤處理
    if (error.response) {
      const { data, status } = error.response;
      
      // 處理後端回傳的錯誤
      if (data && typeof data === 'object') {
        if (data.success === false) {
          // 新格式錯誤
          ElMessage.error(data.message || '操作失敗');
          error.errorCode = data.errorCode;
        } else if (data.message) {
          // 舊格式錯誤
          ElMessage.error(data.message);
        }
      }
      
      // 特殊狀態碼處理
      switch (status) {
        case 401:
          ElMessage.error('請先登入');
          // 導向登入頁
          window.location.href = '/login';
          break;
        case 403:
          ElMessage.error('無權限訪問');
          break;
        case 404:
          ElMessage.error('資源不存在');
          break;
        case 500:
          ElMessage.error('伺服器錯誤');
          break;
      }
    } else if (error.request) {
      ElMessage.error('網路連線失敗');
    } else {
      ElMessage.error(error.message || '未知錯誤');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### 方案 2: 封裝請求方法

#### `src/utils/request.js`
```javascript
import axios from 'axios';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
});

// 封裝統一的請求方法
export const request = async (config) => {
  try {
    const response = await service(config);
    const { data } = response;
    
    // 處理新格式
    if (data && typeof data === 'object' && 'success' in data) {
      if (data.success) {
        return { success: true, data: data.data, message: data.message };
      } else {
        return { 
          success: false, 
          error: data.message, 
          errorCode: data.errorCode 
        };
      }
    }
    
    // 舊格式
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      errorCode: error.errorCode 
    };
  }
};

// 使用範例
export const getUser = async (id) => {
  return request({
    method: 'GET',
    url: `/api/users/${id}`
  });
};
```

## 📝 具體 API 調整範例

### 使用者註冊

#### 舊寫法
```javascript
// auth.js
export const register = async (userData) => {
  try {
    const response = await api.post('/api/users/register', userData);
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw error;
  }
};

// 使用
try {
  const result = await register(formData);
  ElMessage.success(result.message);
} catch (error) {
  ElMessage.error(error.message);
}
```

#### 新寫法（使用全域攔截器）
```javascript
// auth.js
export const register = (userData) => {
  return api.post('/api/users/register', userData);
};

// 使用
try {
  await register(formData);
  ElMessage.success('註冊成功');
} catch (error) {
  // 錯誤已在攔截器中處理
  console.error(error.errorCode, error.message);
}
```

### 獲取使用者資料

#### 舊寫法
```javascript
const { data } = await api.get('/api/users/me/profile');
user.value = data;
```

#### 新寫法（使用全域攔截器）
```javascript
// 攔截器自動解包 data，可直接使用
const userData = await api.get('/api/users/me/profile');
user.value = userData;
```

### 借閱書籍

#### 舊寫法
```javascript
const response = await api.post('/api/loans/borrow', borrowData);
if (response.data.success) {
  ElMessage.success(response.data.message);
} else {
  ElMessage.error(response.data.message);
}
```

#### 新寫法（使用全域攔截器）
```javascript
try {
  const result = await api.post('/api/loans/borrow', borrowData);
  ElMessage.success('借閱成功');
  return result; // BorrowRespDto
} catch (error) {
  // 錯誤訊息已在攔截器中顯示
  throw error;
}
```

## 🎯 Store 調整範例

### Pinia Store

```javascript
// stores/user.js
import { defineStore } from 'pinia';
import api from '@/api';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchUserProfile() {
      this.loading = true;
      this.error = null;
      
      try {
        // 使用全域攔截器，直接獲取解包後的資料
        this.userInfo = await api.get('/api/users/me/profile');
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateProfile(updateData) {
      try {
        const updated = await api.put('/api/users/me/profile', updateData);
        this.userInfo = updated;
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          errorCode: error.errorCode,
          message: error.message 
        };
      }
    }
  }
});
```

## 🔍 錯誤碼處理

### 建立錯誤碼對照表

```javascript
// constants/errorCodes.js
export const ERROR_MESSAGES = {
  // 使用者相關 (2xxx)
  '2001': '使用者不存在',
  '2002': '使用者已存在',
  '2003': '帳號或密碼錯誤',
  '2007': '帳號已存在',
  '2008': '電子郵件已存在',
  '2010': '原密碼不正確',
  
  // 借閱相關 (4xxx)
  '4001': '借閱記錄不存在',
  '4002': '借閱數量已達上限',
  '4005': '續借次數已達上限',
  
  // 預約相關 (5xxx)
  '5002': '預約數量已達上限',
  '5003': '已預約此書籍',
  
  // 更多...
};

// 使用
export const getErrorMessage = (errorCode, defaultMessage) => {
  return ERROR_MESSAGES[errorCode] || defaultMessage || '操作失敗';
};
```

### 在攔截器中使用

```javascript
import { getErrorMessage } from '@/constants/errorCodes';

// 回應攔截器
api.interceptors.response.use(
  response => {
    // ...
  },
  error => {
    if (error.errorCode) {
      const message = getErrorMessage(error.errorCode, error.message);
      ElMessage.error(message);
    }
    return Promise.reject(error);
  }
);
```

## ✅ 遷移檢查清單

- [ ] 更新 `src/api/index.js` 的攔截器
- [ ] 調整所有 API 調用方法
- [ ] 更新 Pinia/Vuex stores
- [ ] 調整錯誤處理邏輯
- [ ] 建立錯誤碼對照表
- [ ] 測試所有 API 端點
- [ ] 更新單元測試

## 🚨 注意事項

1. **逐步遷移**: 建議先更新攔截器，再逐個模組調整
2. **向後相容**: 攔截器應同時支援新舊格式
3. **錯誤處理**: 確保所有錯誤都有適當的使用者提示
4. **測試**: 充分測試成功和失敗場景
5. **文檔**: 更新團隊文檔，說明新的 API 調用方式

## 📞 需要協助？

如遇到問題，請檢查：
1. 瀏覽器開發者工具的 Network 標籤
2. 後端日誌中的錯誤訊息
3. 前端 console 的錯誤輸出

建議使用 Postman 或類似工具先測試後端 API，確認回應格式正確。

