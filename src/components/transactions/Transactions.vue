<script setup>
import TransactionTable from './TransactionTable.vue'
import { useTransactionStore } from '../../stores/transaction'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const router = useRouter()
const toast = useToast()
const transactionStore = useTransactionStore()

const loadTransactions = async () => {
  try {
    await transactionStore.loadTransactions()
  } catch (error) {
    console.log(error)
  }
}

const filterByType = ref(null)

const filteredTransactions = computed(() =>
  transactionStore.getTransactionsByFilter(filterByType.value)
)

const totalTransactions = computed(() =>
  transactionStore.getTransactionsByFilterTotal(filterByType.value)
)

const editCategory = (transaction) => {
  router.push({ name: 'Transaction', params: { id: transaction.id } })
}


onMounted(() => {
    loadTransactions()
})

</script>

<template>
  <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">Transactions</h3>
    </div>
    <div class="mx-2 total-filtro">
      <h5 class="mt-4">Total: {{ totalTransactions }}</h5>
    </div>
  </div>
  <hr>
  <div class="mb-3 d-flex justify-content-between flex-wrap">
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="selectStatus" class="form-label">Filter by type:</label>
      <select class="form-select" id="selectStatus" v-model="filterByType">
        <option :value="null"></option>
        <option value="D">Debit</option>
        <option value="C">Credit</option>
      </select>
    </div>
  </div>
  <h5 v-if="totalTransactions == 0">You have no transactions</h5>
  <transaction-table v-else
   :transactions="filteredTransactions"
   @edit="editCategory"
   >
  </transaction-table>
</template>


<style scoped>
.filter-div {
  min-width: 12rem;
}
.total-filtro {
  margin-top: 0.35rem;
}
</style>