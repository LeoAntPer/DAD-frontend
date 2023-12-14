<script setup>
import { onMounted, ref, inject } from 'vue'
import BarChart from './BarChart.vue'
import LineChart from './LineChart.vue'

const statistics = ref(null)
const axios = inject('axios')

const loadStatistics = async () => {
  try {
    const response = await axios.get('/statistics')
    statistics.value = response.data

  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  loadStatistics()
})
</script>

<template>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Statistics</h1>
  </div>

  <div v-if="statistics" class="container mt-5">
    <div class="row">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 h-100">
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Total vCards</h5>
            <p class="card-text">{{ statistics['total_vcards'] }}</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 h-100">
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">vCards ativos</h5>
            <p class="card-text">{{ statistics['total_active_vcards'] }}</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 h-100">
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">vCards bloqueados</h5>
            <p class="card-text">{{ statistics['total_blocked_vcards'] }}</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 h-100">
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Total de transações</h5>
            <p class="card-text">{{ statistics['total_transactions'] }}</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 h-100">
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Balanço total</h5>
            <p class="card-text">{{ statistics['total_balance'] }}€</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12 col-lg-6" v-if="statistics">
        <h4>Transações/mês</h4>
        <LineChart :data="statistics['total_transactions_by_month']" />
      </div>

      <div class="col-12 col-lg-6" v-if="statistics">
        <h4>Transações/tipo</h4>
        <BarChart :data="statistics['total_transactions_by_type']" />
      </div>
    </div>
  </div>
  <br>
  <br>
</template>