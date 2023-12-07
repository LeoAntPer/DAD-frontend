import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import Login from "../components/auth/Login.vue"
import ChangePassword from "../components/auth/ChangePassword.vue"
import Transaction from "../components/transactions/Transaction.vue"
import Transactions from "../components/transactions/Transactions.vue"
import Category from "../components/categories/Category.vue"
import Categories from "../components/categories/Categories.vue"
import VCard from "../components/vcard/VCard.vue"
import VCards from "../components/vcard/VCards.vue"
import Admin from "../components/admins/Admin.vue"
import Admins from "../components/admins/Admins.vue"
import HomeView from "../views/HomeView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/password',
      name: 'ChangePassword',
      component: ChangePassword
    },

    //Transaction
    {
      path: '/transaction/new',
      name: 'NewTransaction',
      component: Transaction,
      props: { id: -1 }
    },
    {
      path: '/transactions/:id',
      name: 'Transaction',
      component: Transaction,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: Transactions,
    },

    //Categories
    {
      path: '/category/new',
      name: 'NewCategory',
      component: Category,
      props: { id: -1 }
    },
    {
      path: '/categories/:id',
      name: 'Category',
      component: Category,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/categories',
      name: 'Categories',
      component: Categories,
    },

    //VCards
    {
      path: '/vcards/:id',
      name: 'VCard',
      component: VCard,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/vcards',
      name: 'VCards',
      component: VCards,
    },

    //Admin  
    {
      path: '/admins/:id',
      name: 'Admin',
      component: Admin,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: "/admins",
      name: 'Admins',
      component: Admins,
      props: route => ({ id: parseInt(route.params.id )})
    },

    //Others
    {
      path: '/statistics',
      name: 'Statistics',
      component: Categories,
    },
  ]
})

export default router
