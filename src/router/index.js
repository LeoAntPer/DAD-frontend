import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import Transaction from "../components/transactions/Transaction.vue"
import Transactions from "../components/transactions/Transactions.vue"
import Category from "../components/categories/Category.vue"
import Categories from "../components/categories/Categories.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
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
      component: Transaction,
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

    //
    {
      path: '/statistics',
      name: 'Statistics',
      component: Categories,
    },

  ]
})

export default router
