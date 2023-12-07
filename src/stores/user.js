import { ref, computed, inject } from 'vue'
import avatarNoneUrl from '@/assets/avatar-none.png'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
    const axios = inject('axios')
    const serverBaseUrl = inject('serverBaseUrl')

    const user = ref(null)

    const userName = computed(() => user.value?.name ?? 'Anonymous')

    const userId = computed(() => user.value?.id ?? -1)

    const userType = computed(() => user.value?.type ?? 'V')

    async function loadUser() {
        try {
            const response = await axios.get('auth/me')
            user.value = response.data.data
        } catch (error) {
            clearUser()
            throw error
        }
    }

    const userPhotoUrl = computed(() =>
        user.value?.photo_url
        ? serverBaseUrl + '/storage/fotos/' + user.value.photo_url
        : avatarNoneUrl)

    function clearUser() {
        delete axios.defaults.headers.common.Authorization
        sessionStorage.removeItem('token')
        user.value = null
    }

    async function login(credentials) {
        try {
            const response = await axios.post('auth/login', credentials)
            axios.defaults.headers.common.Authorization = "Bearer " + response.data.access_token
            sessionStorage.setItem('token', response.data.access_token)
            await loadUser()
            //socket.emit('loggedIn', user.value)
            return true
        }
        catch(error) {
            clearUser()
            return false
        }
    }

    async function logout () {
        try {
            await axios.post('auth/logout')
            //socket.emit('loggedOut', user.value)
            clearUser()
            return true
        } catch (error) {
            return false
        }
    }

    async function restoreToken () {
        let storedToken = sessionStorage.getItem('token')
        if (storedToken) {
            axios.defaults.headers.common.Authorization = "Bearer " + storedToken
            await loadUser()
            //socket.emit('loggedIn', user.value)
            return true
        }
        clearUser()
        return false
    }

    return {
        user,
        userId,
        userName,
        userType,
        login,
        logout,
        loadUser,
        clearUser,
        userPhotoUrl,
        restoreToken
    }
})
