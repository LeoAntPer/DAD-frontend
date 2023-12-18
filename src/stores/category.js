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
            await axios.get('auth/me')
            if(userStore.userType == 'A')
            {
                const response = await axios.get('defaultCategories')
                categories.value = response.data.data
            }
            else if(userStore.userId != -1 && userStore.userType == 'V')
            {
                const response = await axios.get('vcards/' + userStore.userId + '/categories')
                categories.value = response.data.data
            }
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
        if(userStore.userType == 'A')
        {
            return categories.value.filter( cat => 
            (!type || cat.type == type))
        }
        else
        {
            return categories.value.filter( cat => 
            (!type || cat.type == type))
        }
    }

    function getCategoriesByFilterTotal(type) {
        if(userStore.userType == 'A')
        {
            return categories.value.filter( cat => 
            (!type || cat.type == type)).length
        }
        else
        {
            return categories.value.filter( cat => 
            (cat.vcard == userStore.userId) &&
            (!type || cat.type == type)).length
        }
        
    }

    async function insertCategory(newCategory) {
        // Note that when an error occours, the exception should be
        // catch by the function that called the insertProject
        var response = 0;
        if(userStore.userType == 'A')
        {
            response = await axios.post('defaultCategories', newCategory)
            categories.value.push(response.data.data)
        }
        else
        {
            response = await axios.post('categories', newCategory)
            categories.value.push(response.data.data)
        }
        
        //socket.emit('newProject', response.data.data)
        return response.data.data
    }

    function updateCategoryOnArray(category) {
        let idx = categories.value.findIndex((t) => t.id === category.id)
        if (idx >= 0) {
            categories.value[idx] = category
        }
    }

    async function updateCategory(updateCategory) {
        // Note that when an error occours, the exception should be
        // catch by the function that called the updateProject
        var response;
        if(userStore.userType == 'A')
        {
            response = await axios.put('defaultCategories/' + updateCategory.id, updateCategory)
            updateCategoryOnArray(response.data.data)
        }
        else
        {
            response = await axios.put('categories/' + updateCategory.id, updateCategory)
            updateCategoryOnArray(response.data.data)
        }
        
        //socket.emit('updateProject', response.data.data)
        return response.data.data
    }

    function deleteCategoryOnArray(category) {
        let idx = categories.value.findIndex((t) => t.id === category.id)
        if (idx >= 0) {
            categories.value.splice(idx, 1)
        }
    }

    async function deleteCategory( deleteCategory) {
        // Note that when an error occours, the exception should be
        // catch by the function that called the deleteProject
        var response;
        if(userStore.userType == 'A')
        {
            response = await axios.delete('defaultCategories/' + deleteCategory.id)
            deleteCategoryOnArray(response.data.data)
        }
        else
        {
            response = await axios.delete('categories/' + deleteCategory.id)
            deleteCategoryOnArray(response.data.data)
        }
        
        //socket.emit('deleteProject', response.data.data)
        return response.data.data
    }


    return {
        categories,
        loadCategories,
        clearCategories,
        totalCategories,
        getCategoriesByFilter,
        getCategoriesByFilterTotal,
        deleteCategory,
        insertCategory,
        updateCategory
    }
})