import apiClient from './index'

export const loansAPI = {
  /**
   * 獲取當前借閱
   */
  getCurrentLoans() {
    return apiClient.get('/loans/current')
  },

  /**
   * 獲取借閱歷史
   */
  getHistory() {
    return apiClient.get('/loans/history')
  },

  /**
   * 獲取逾期借閱
   */
  getOverdue() {
    return apiClient.get('/loans/overdue')
  },

  /**
   * 續借
   * @param {number} loanId - 借閱ID
   */
  renew(loanId) {
    return apiClient.put(`/loans/${loanId}/renew`)
  },

  /**
   * 借書（管理員功能）
   * @param {string} uniqueCode - 書籍副本唯一碼
   */
  borrow(uniqueCode) {
    return apiClient.post('/loans/borrow', { uniqueCode })
  },

  /**
   * 還書（管理員功能）
   * @param {string} uniqueCode - 書籍副本唯一碼
   */
  return(uniqueCode) {
    return apiClient.post('/loans/return', { uniqueCode })
  }
}

