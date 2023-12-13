<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
    transaction: {
        type: Object,
        required: true
    },
    categories: {
        type: Array,
        required: true
    },
    operationType: {
        type: String,
        default: 'update'  // insert / update
    },
    errors: {
        type: Object,
        required: false,
    },
})

const emit = defineEmits(['save', 'cancel'])

const editingTransaction = ref(props.transaction)

watch(
    () => props.transaction,
    (newTransaction) => {
        editingTransaction.value = newTransaction
    }
)

const transactionTitle = computed(() => {
    if (!editingTransaction.value) {
        return ''
    }
    return props.operationType == 'insert' ? 'New Transaction' : 'Transaction #' + editingTransaction.value.id
})

const save = () => {
    emit('save', editingTransaction.value)
}

const cancel = () => {
    emit('cancel', editingTransaction.value)
}

</script>

<template>
    <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
        <h3 class="mt-5 mb-3">{{ transactionTitle }}</h3>
        <hr>

        <div class="mb-3">
            <label for="inputDescription" class="form-label">Description</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': errors ? errors['descrition'] : false }"
                id="inputDescription" placeholder="Transaction Description" v-model="editingTransaction.description">
            <field-error-message :errors="errors" fieldName="description"></field-error-message>
        </div>

        <select class="form-select pe-2" :class="{ 'is-invalid': errors ? errors['category_id'] : false }"
            id="inputCategory" v-model="editingTransaction.category_id">
            <option :value="null">-- No Category --</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>

        <div class="mb-3 d-flex justify-content-end">
            <button type="button" class="btn btn-primary px-5" @click="save">Save</button>
            <button type="button" class="btn btn-light px-5" @click="cancel">Cancel</button>
        </div>
    </form>
</template>


<style scoped></style>
