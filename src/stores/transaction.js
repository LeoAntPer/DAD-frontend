import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './user.js'
//import { useToast } from 'vue-toast-notification'

export const useTransactionStore = defineStore('transaction', () => {
    //const toast = useToast()
    const axios = inject('axios')
    const userStore = useUserStore()

    const transactions = ref([])

    const totalTransactions = computed(() => {
        return transactions.value.length
    })

    async function loadTransactions() {
        try {
            const response = await axios.get(`vcards/${userStore.userId}/transactions`)
            transactions.value = response.data.data
            return transactions.value
        }
        catch (error) {
            clearTransactions()
            throw error
        }
    }

    function clearTransactions() {
        transactions.value = []
    }

    function getTransactionsByFilter(type) {
        return transactions.value.filter( transaction => 
            (!type || transaction.type == type)
        )
    }

    function getTransactionsByFilterTotal(type) {
        return transactions.value.filter( transaction => 
            (!type || transaction.type == type)
        ).length
    }


    return {
        transactions,
        totalTransactions,
        loadTransactions,
        clearTransactions,
        getTransactionsByFilter,
        getTransactionsByFilterTotal,
    }
})