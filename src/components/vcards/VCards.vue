<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, inject } from 'vue'
import VCardTable from './VCardTable.vue'

const router = useRouter()
const axios = inject('axios')

const vcards = ref([])

const loadVCards = async () => {
    try {
        const response = await axios.get('/vcards')
        vcards.value = response.data.data
    } catch(error) {
        console.log(error)
    }
}

const editUser = (vcard) => {
    router.push({name: 'VCard', params: {phone_number: vcard.phone_number}})
}

onMounted(() => {
    loadVCards()
})
</script>

<template>
    <h3 class="mt-5 mb-3">VCards</h3>
    <hr>
    <VCardTable
        :vcards="vcards"
        :showId="false"
        @edit="editUser">
    </VCardTable>
</template>


<style scoped>

</style>