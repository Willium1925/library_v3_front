import apiClient from '../index'

export const adminLoansAPI = {
  // 借書
  borrow(data) {
    return apiClient.post('/loans/borrow', data)
  },

  // 還書
  return(data) {
    return apiClient.post('/loans/return', data)
  }
}
export default adminLoansAPI


