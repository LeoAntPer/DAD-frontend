<script setup>
import TransactionTable from './TransactionTable.vue'
import { useTransactionStore } from '../../stores/transaction'
import { useCategoryStore } from '../../stores/category'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const router = useRouter()
const toast = useToast()
const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()

const loadTransactions = async () => {
  try {
    await transactionStore.loadTransactions()
  } catch (error) {
    console.log(error)
  }
}

const filterByType = ref(null)
const filterByCategory = ref(-1)

const filteredTransactions = computed(() =>
  transactionStore.getTransactionsByFilter(filterByType.value, filterByCategory.value)
)

const totalTransactions = computed(() =>
  transactionStore.getTransactionsByFilterTotal(filterByType.value, filterByCategory.value)
)

const newTransaction = () => {
  router.push({ name: 'NewTransaction' })
}


const editTransaction = (transaction) => {
  router.push({ name: 'Transaction', params: { id: transaction.id } })
}

const categories = ref([])

const loadCategories = async () => {
  try {
    await categoryStore.loadCategories()
    categories.value = categoryStore.getCategoriesByFilter()
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
    loadTransactions()
    loadCategories()
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
      <label for="selectType" class="form-label">Filter by type:</label>
      <select class="form-select" id="selectType" v-model="filterByType">
        <option :value="null"></option>
        <option value="D">Debit</option>
        <option value="C">Credit</option>
      </select>
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="selectCategory" class="form-label">Filter by Category:</label>
      <select class="form-select" id="selectCategory" v-model="filterByCategory">
        <option :value="-1"></option>
        <option :value="null">-- No Category --</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select>
    </div>
    <div class="mx-2 mt-2">
      <button type="button" class="btn btn-success px-4 btn-addprj" @click="newTransaction">
        <i class="bi bi-xs bi-plus-circle"></i>&nbsp; New
        Transaction
      </button>
    </div>
  </div>
  <h5 v-if="totalTransactions == 0">You have no transactions {{ (filterByType || (filterByCategory != -1)) ? 'with this filter' : ''}}</h5>
  <transaction-table v-else
   :transactions="filteredTransactions"
   @edit="editTransaction"
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
.btn-addprj {
  margin-top: 1.85rem;
}
</style>