<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, inject } from 'vue'
import VCardTable from './VCardTable.vue'
import { useToast } from 'vue-toast-notification';

const router = useRouter()
const axios = inject('axios')
const toast = useToast()

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

const blockVcard = (vcard) => {
    try {
        axios.patch("vcards/" + vcard.phone_number + "/blocked", {blocked: 1})
        toast.success('VCard ' + vcard.phone_number + ' was blocked!')
        loadVCards()
    }
    catch(error) {
        console.log(error)
        toast.error('Error occured while blocking VCard ' + vcard.phone_number)
    }
}

const unblockVcard = (vcard) => {
    try {
        axios.patch("vcards/" + vcard.phone_number + "/blocked", {blocked: 0})
        toast.success('VCard ' + vcard.phone_number + ' was unblocked!')
        loadVCards()
    }
    catch(error) {
        console.log(error)
        toast.error('Error occured while unblocking VCard ' + vcard.phone_number)
    }
}

const deleteVcard = (vcard) => {
    try {
        axios.delete("vcards/" + vcard.phone_number + '/admin')
        toast.success('VCard' + vcard.phone_number + ' was deleted!')
    } catch(error) {
        console.log(error)
        toast.error('Error occured while deleting VCard' + vcard.phone_number)
    }
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
        @edit="editUser"
        @block="blockVcard"
        @unblock="unblockVcard"
        @delete="deleteVcard">
    </VCardTable>
</template>


<style scoped>

</style>