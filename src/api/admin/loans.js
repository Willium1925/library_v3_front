import apiClient from '../index'

export const adminLoansAPI = {
  // 借書
  borrow(data) {
    return apiClient.post('/loans/borrow', data)
  },

  // 還書
  returnBook(uniqueCode) {
    return apiClient.post('/loans/return', { uniqueCode })
  }
}
export default adminLoansAPI


