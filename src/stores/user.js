import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loansAPI } from '../api/loans'
import { reservationsAPI } from '../api/reservations'

export const useUserStore = defineStore('user', () => {
  // State
  const currentLoans = ref([])
  const loanHistory = ref([])
  const overdueLoans = ref([])
  const reservations = ref([])
  const favorites = ref([])
  const loading = ref(false)
  
  // Actions - Loans
  async function fetchCurrentLoans() {
    try {
      loading.value = true
      currentLoans.value = await loansAPI.getCurrentLoans()
    } catch (error) {
      console.error('獲取當前借閱失敗:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  async function fetchLoanHistory() {
    try {
      loading.value = true
      loanHistory.value = await loansAPI.getHistory()
    } catch (error) {
      console.error('獲取借閱歷史失敗:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  async function fetchOverdueLoans() {
    try {
      loading.value = true
      overdueLoans.value = await loansAPI.getOverdue()
    } catch (error) {
      console.error('獲取逾期借閱失敗:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  async function renewLoan(loanId) {
    try {
      await loansAPI.renew(loanId)
      // 重新獲取借閱列表
      await fetchCurrentLoans()
    } catch (error) {
      console.error('續借失敗:', error)
      throw error
    }
  }
  
  // Actions - Reservations
  async function fetchReservations() {
    try {
      loading.value = true
      reservations.value = await reservationsAPI.getMyReservations()
    } catch (error) {
      console.error('獲取預約列表失敗:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  async function cancelReservation(reservationId) {
    try {
      await reservationsAPI.cancel(reservationId)
      // 重新獲取預約列表
      await fetchReservations()
    } catch (error) {
      console.error('取消預約失敗:', error)
      throw error
    }
  }
  
  return {
    currentLoans,
    loanHistory,
    overdueLoans,
    reservations,
    favorites,
    loading,
    fetchCurrentLoans,
    fetchLoanHistory,
    fetchOverdueLoans,
    renewLoan,
    fetchReservations,
    cancelReservation
  }
})

