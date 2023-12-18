<script setup>
import { useRouter, RouterLink, RouterView } from 'vue-router'
import { useUserStore } from './stores/user';
import { onMounted, computed, inject, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
//import LaravelTester from './components/LaravelTester.vue';
//import WebSocketTester from './components/WebSocketTester.vue';


const router = useRouter()
const axios = inject("axios")
const toast = useToast()
const userStore = useUserStore()

const getProfileLink = computed(() => {
  if (userStore.userType === 'V') {
        return {
          name: 'VCard',
          params: { phone_number: userStore.userId },
        };
      } else if (userStore.userType === 'A') {
        return { 
          name: 'Admin',
          params: {id: userStore.userId } }; // Adjust 'Admin' to the actual route name for admins
      } else {
        // Handle other user types or provide a default link
        return { name: 'DefaultRoute' };
      }
})

const clickMenuOption = () => {
  const domReference = document.getElementById('buttonSidebarExpandId')
  if (domReference) {
    if (window.getComputedStyle(domReference).display !== "none") {
      domReference.click()
    }
  }
}


const logout = async () => {
  if (await userStore.logout()) {
    toast.success('User has logged out of the application.')
    clickMenuOption()
    router.push({ name: 'home' })
  } else {
    toast.error('There was a problem logging out of the application!')
  }
}

const deleteUser= async () => {
  const user = ref(null)
  if(userStore.userType == 'V') {
     router.push({ name: 'DeleteVcard' })
  }
  else {
    const response = await axios.delete("/users/" + userStore.userId)
    user.value = response.data.data
  }
  toast.success('User #' + user.value.phone_number + ' was deleted successfully.')

  logout()
}

onMounted(() => {
  userStore.restoreToken()
})

</script>

<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark sticky-top flex-md-nowrap p-0 shadow">
    <div class="container-fluid">
      <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">
        <router-link class="nav-link" :class="{ active: $route.name === 'Dashboard' }" :to="{ name: 'Dashboard' }">
          <img src="@/assets/logo.png" alt="" width="40" height="40" class="d-inline-block ">
          VCard
        </router-link>
      </a>
      <button id="buttonSidebarExpandId" class="navbar-toggler" type="button" data-bs-toggle="collapse"
        @click="clickMenuOption" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end">
        <ul class="navbar-nav">
          <li class="nav-item" v-show="!userStore.user">
            <router-link class="nav-link" :class="{ active: $route.name === 'NewVCard' }" :to="{ name: 'NewVCard' }" @click="clickMenuOption">
              <i class="bi bi-person-check-fill"></i>
              Register
            </router-link>
          </li>
          <li class="nav-item" v-show="!userStore.user">
            <router-link class="nav-link" :class="{ active: $route.name === 'Login' }" :to="{ name: 'Login' }"
              @click="clickMenuOption">
              <i class="bi bi-box-arrow-in-right"></i>
              Login
            </router-link>
          </li>
          <li class="nav-item dropdown" v-show="userStore.user">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
              data-bs-toggle="dropdown" aria-expanded="false">
              <img :src="userStore.userPhotoUrl" class="rounded-circle z-depth-0 avatar-img" alt="avatar image">
              <span class="avatar-text">{{ userStore.userName }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
              <li>
                <router-link class="dropdown-item" :class="{ active: $route.name === (userStore.userType === 'V' ? 'VCard' : 'Admin') }"
                :to="getProfileLink" @click="clickMenuOption">
                  <i class="bi bi-person-square"></i>
                  Profile
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" :class="{ active: $route.name === 'ChangePassword' }"
                  :to="{ name: 'ChangePassword' }" @click="clickMenuOption">
                  <i class="bi bi-key-fill"></i>
                  Change password
                </router-link>
              </li>
              <li v-if="userStore.userType === 'V'">
                <router-link class="dropdown-item" :class="{ active: $route.name === 'ChangeConfirmationCode' }"
                  :to="{ name: 'ChangeConfirmationCode' }" @click="clickMenuOption">
                  <i class="bi bi-key-fill"></i>
                  Change confirmation code
                </router-link>
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li>
                <a class="dropdown-item" @click.prevent="logout"><i class="bi bi-arrow-right"></i>Logout</a>
              </li>
              <li>
                <a class="dropdown-item" @click.prevent="deleteUser"><i class="bi bi-x"></i>Delete VCard</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="container-fluid" >
    <div class="row">
      <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse" v-if="userStore.user">
        <div class="position-sticky pt-3">
          <ul class="nav flex-column">
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.name === 'Dashboard' }" :to="{ name: 'Dashboard' }">
                <i class="bi bi-bank"></i>
                Dashboard
              </router-link>
            </li>
            <li class="nav-item" v-if="userStore.userType == 'A'">
              <router-link class="nav-link" :class="{ active: $route.name == 'Admins' }" :to="{ name: 'Admins' }" @click="clickMenuOption">
                <i class="bi bi-person"></i>
                Admins
              </router-link>
            </li>
            <li class="nav-item" v-if="userStore.userType == 'A'">
              <router-link class="nav-link" :class="{ active: $route.name == 'VCards' }" :to="{ name: 'VCards' }">
                <i class="bi bi-credit-card"></i>
                VCards
              </router-link>
            </li>
            <li class="nav-item" v-if="userStore.userId != -1 && userStore.userType == 'V'">
              <router-link class="nav-link" :class="{ active: $route.name === 'Transactions' }"
                :to="{ name: 'Transactions' }">
                <i class="bi bi-wallet2"></i>
                Transactions
              </router-link>
            </li>
            <li class="nav-item" v-if="userStore.userId != -1 && userStore.userType == 'V'">
              <router-link class="nav-link" :class="{ active: $route.name === 'Categories' }"
                :to="{ name: 'Categories' }">
                <i class="bi bi-list-task"></i>
                Categories
              </router-link>
            </li>
            <li class="nav-item" v-if="userStore.userType == 'A'">
              <router-link class="nav-link" :class="{ active: $route.name === 'DefaultCategories' }"
                :to="{ name: 'Categories' }">
                <i class="bi bi-list-task"></i>
                Default Categories
              </router-link>
            </li>
            <li class="nav-item" v-if="userStore.userId != -1">
              <router-link class="nav-link" :class="{ active: $route.name === 'Statistics' }"
                :to="{ name: 'Statistics' }">
                <i class="bi bi-graph-up"></i>
                Estatisticas
              </router-link>
            </li>
          </ul>

          <div class="d-block d-md-none">
            <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>User</span>
            </h6>
            <ul class="nav flex-column mb-2">
              <li class="nav-item" v-show="!userStore.user">
                <router-link class="nav-link" :class="{ active: $route.name === 'NewVCard' }" :to="{ name: 'NewVCard' }" @click="clickMenuOption">
                  <i class="bi bi-person-check-fill"></i>
                  Register
                </router-link>
              </li>
              <li class="nav-item" v-show="!userStore.user">
                <router-link class="nav-link" :class="{ active: $route.name === 'Login' }" :to="{ name: 'Login' }"
                  @click="clickMenuOption">
                  <i class="bi bi-box-arrow-in-right"></i>
                  Login
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" :class="{ active: $route.name === (userStore.userType === 'V' ? 'VCard' : 'Admin') }"
                :to="getProfileLink" @click="clickMenuOption">
                  <i class="bi bi-person-square"></i>
                  Profile
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" :class="{ active: $route.name === 'ChangePassword' }"
                  :to="{ name: 'ChangePassword' }" @click="clickMenuOption">
                  <i class="bi bi-key-fill"></i>
                  Change password
                </router-link>
              </li>
              <li v-if="userStore.userType === 'V'">
                <router-link class="dropdown-item" :class="{ active: $route.name === 'ChangeConfirmationCode' }"
                  :to="{ name: 'ChangeConfirmationCode' }" @click="clickMenuOption">
                  <i class="bi bi-key-fill"></i>
                  Change confirmation code
                </router-link>
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li>
                <a class="dropdown-item" @click.prevent="logout"><i class="bi bi-arrow-right"></i>Logout</a>
              </li>
              <li>
                <a class="dropdown-item" @click.prevent="deleteUser"><i class="bi bi-x"></i>Delete VCard</a>
              </li>
            </ul>
          </div>

        </div>
      </nav>

      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<style>
@import "./assets/dashboard.css";

.avatar-img {
  margin: -1.2rem 0.8rem -2rem 0.8rem;
  width: 3.3rem;
  height: 3.3rem;
}

.avatar-text {
  line-height: 2.2rem;
  margin: 1rem 0.5rem -2rem 0;
  padding-top: 1rem;
}

.dropdown-item {
  font-size: 0.875rem;
}

.btn:focus {
  outline: none;
  box-shadow: none;
}

#sidebarMenu {
  overflow-y: auto;
}
</style>
