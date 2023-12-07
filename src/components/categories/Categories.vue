<script setup>
import CategoryTable from './CategoryTable.vue'
import { useCategoryStore } from '../../stores/category'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const router = useRouter()
const toast = useToast()
const categoryStore = useCategoryStore()

const loadCategories = async () => {
  try {
    await categoryStore.loadCategories()
  } catch (error) {
    console.log(error)
  }
}

const filterByType = ref(null)

const filteredCategories = computed(() =>
  categoryStore.getCategoriesByFilter(filterByType.value)
)

const totalCategories = computed(() =>
  categoryStore.getCategoriesByFilterTotal(filterByType.value)
)

const addCategory = () => {
    router.push({ name: 'NewCategory' })
}

const editCategory = (category) => {
  router.push({ name: 'Category', params: { id: category.id } })
}

const categoryToDelete = ref(null)
const categoryToDeleteDescription = computed(() => {
  return categoryToDelete.value ? `#${categoryToDelete.value.id} (${categoryToDelete.value.name})` : ""
})
const deleteConfirmationDialog = ref(null)

const deleteCategory = (project) => {
  categoryToDelete.value = project
  deleteConfirmationDialog.value.show()
}

const deleteCategoryConfirmed = async () => {
  try {
    await categoryStore.deleteCategory(categoryToDelete.value)
    toast.info(`Category ${categoryToDeleteDescription.value} was deleted`)
  } catch (error) {
    console.log(error)
    toast.error(`It was not possible to delete Category ${categoryToDeleteDescription.value}!`)
  }  
}


onMounted(() => {
    loadCategories()
})

</script>

<template>
  <confirmation-dialog
    ref="deleteConfirmationDialog"
    confirmationBtn="Delete category"
    :msg="`Do you really want to delete the category ${categoryToDeleteDescription}?`"
    @confirmed="deleteCategoryConfirmed"
  >
  </confirmation-dialog>
  <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">Categories</h3>
    </div>
    <div class="mx-2 total-filtro">
      <h5 class="mt-4">Total: {{ totalCategories }}</h5>
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
    <div class="mx-2 mt-2">
      <button type="button" class="btn btn-success px-4 btn-addprj" @click="addCategory">
        <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add
        Category
      </button>
    </div>
  </div>
  <h5 v-if="totalCategories == 0">You have no categories</h5>
  <category-table v-else
   :categories="filteredCategories"
   @edit="editCategory"
   @delete="deleteCategory"
   >
   </category-table>
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