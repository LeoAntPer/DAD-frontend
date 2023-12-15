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
    }
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

const isInsertOperation = ref(props.operationType == 'insert')

</script>

<template>
    <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
        <h3 class="mt-5 mb-3">{{ transactionTitle }}</h3>
        <hr>

        <!--VALUE-->
        <div class="mb-3">
            <label for="inputValue" class="form-label">Value</label>
            <input type="number" class="form-control" :class="{ 'is-invalid': errors ? errors['value'] : false }"
                id="inputValue" placeholder="Value" v-model="editingTransaction.value" :disabled="!isInsertOperation">
            <field-error-message :errors="errors" fieldName="value"></field-error-message>
        </div>

        <!--PAYMENT TYPE-->
        <div class="mb-3">
            <label for="inputPaymentTipe" class="form-label">Payment Type</label>
            <select class="form-select pe-2" :class="{ 'is-invalid': errors ? errors['payment_type'] : false }" :disabled="!isInsertOperation"
                id="inputPaymentType" v-model="editingTransaction.payment_type">
                <option>VCARD</option>
                <option>MBWAY</option>
                <option>PAYPAL</option>
                <option>IBAN</option>
                <option>MB</option>
                <option>VISA</option>
            </select>
            <field-error-message :errors="errors" fieldName="payment_type"></field-error-message>
        </div>

        <!--PAYMENT REFERENCE-->
        <div class="mb-3">
            <label for="inputPaymentReference" class="form-label">Payment Reference</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': errors ? errors['payment_value'] : false }"
                id="inputPaymentReference" placeholder="Reference" v-model="editingTransaction.payment_reference" :disabled="!isInsertOperation">
            <field-error-message :errors="errors" fieldName="payment_reference"></field-error-message>
        </div>

        <!--DESCRIPTION-->
        <div class="mb-3">
            <label for="inputDescription" class="form-label">Description</label>
            <input type="text" class="form-control" :class="{ 'is-invalid': errors ? errors['description'] : false }"
                id="inputDescription" placeholder="Description" v-model="editingTransaction.description">
            <field-error-message :errors="errors" fieldName="description"></field-error-message>
        </div>

        <!--CATEGORY-->
        <div class="mb-3">
            <label for="inputCategory" class="form-label">Category</label>
            <select class="form-select pe-2" :class="{ 'is-invalid': errors ? errors['category_id'] : false }"
                id="inputCategory" v-model="editingTransaction.category_id">
                <option :value="null">-- No Category --</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
            <field-error-message :errors="errors" fieldName="category_id"></field-error-message>
        </div>


        <!--BUTTONS-->
        <div v-if="!props.readOnly" class="mb-3 d-flex justify-content-end">
            <button type="button" class="btn btn-primary px-5" @click="save">Save</button>
            <button type="button" class="btn btn-light px-5" @click="cancel">Cancel</button>
        </div>
    </form>
</template>


<style scoped></style>
