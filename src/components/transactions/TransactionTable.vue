<script setup>

const props = defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['edit', 'delete'])

const editClick = (transaction) => {
  emit('edit', transaction)
}

</script>

<template>
    <table class="table">
    <thead>
      <tr>
        <th>Value</th>
        <th>Type</th>
        <th>Old Balance</th>
        <th>New Balance</th>
        <th>Payment Type</th>
        <th>Payment Reference</th>
        <th>Category</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="transaction in transactions" :key="transaction.id">
        <td>{{ transaction.value }}</td>
        <td>{{ transaction.type == 'D' ? 'Debit' : 'Credit' }}</td>
        <td>{{ transaction.old_balance }}</td>
        <td>{{ transaction.new_balance }}</td>
        <td>{{ transaction.payment_type }}</td>
        <td>{{ transaction.payment_reference }}</td>
        <td>{{ transaction.category_name }}</td>

        <td class="text-end">
          <div class="d-flex justify-content-end">
            <button class="btn btn-xs btn-light" @click="editClick(category)"><i
                class="bi bi-xs bi-pencil"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>


<style scoped>
</style>