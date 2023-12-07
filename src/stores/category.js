import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './user.js'
//import { useToast } from 'vue-toast-notification'

export const useCategoryStore = defineStore('category', () => {
    //const toast = useToast()
    const axios = inject('axios')
    const userStore = useUserStore()

    const categories = ref([])

    const totalCategories = computed(() => {
        return categories.value.length
    })

    async function loadCategories() {
        try {
            const response = await axios.get('categories')
            categories.value = response.data.data
            return categories.value
        }
        catch (error) {
            clearCategories()
            throw error
        }
    }

    function clearCategories() {
        categories.value = []
    }


    function getCategoriesByFilter(type) {
        return categories.value.filter( cat => 
            (cat.vcard == userStore.userId) &&
            (!type || cat.type == type)
        )
    }

    function getCategoriesByFilterTotal(type) {
        return categories.value.filter( cat => 
            (cat.vcard == userStore.userId) &&
            (!type || cat.type == type)
        ).length
    }


    return {
        categories,
        loadCategories,
        clearCategories,
        totalCategories,
        getCategoriesByFilter,
        getCategoriesByFilterTotal
    }
})