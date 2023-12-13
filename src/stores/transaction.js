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


    function updateTransactionOnArray(transaction) {
        let idx = transactions.value.findIndex((t) => t.id === transaction.id)
        if (idx >= 0) {
            transactions.value[idx] = transaction
        }
    }

    async function updateTransaction(updateTransaction) {
        // Note that when an error occours, the exception should be
        // catch by the function that called the updateProject
        const response = await axios.put('transactions/' + updateTransaction.id, updateTransaction)
        updateTransactionOnArray(response.data.data)
        //socket.emit('updateProject', response.data.data)
        return response.data.data
    }



    return {
        transactions,
        totalTransactions,
        loadTransactions,
        clearTransactions,
        getTransactionsByFilter,
        getTransactionsByFilterTotal,
        updateTransaction,
    }
})