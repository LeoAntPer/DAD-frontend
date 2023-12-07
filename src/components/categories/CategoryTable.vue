<script setup>

//import { ref, watch } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
})

</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="category in categories" :key="category.id">
        <td>{{ category.name }}</td>
        <td>{{ category.type == 'D' ? 'Debit' : 'Credit' }}</td>
        <td class="text-end">
          <div class="d-flex justify-content-end">
            <button class="btn btn-xs btn-light"><i
                class="bi bi-xs bi-pencil"></i>
            </button>
            <button class="btn btn-xs btn-light"><i
                class="bi bi-xs bi-x-square-fill"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>


<style scoped></style>