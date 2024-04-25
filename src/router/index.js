import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EquiposView from '../views/EquiposView.vue'
import MisionesView from '@/views/MisionesView.vue'
import OperativosView from '@/views/OperativosView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/equipos',
    name: 'equipos',
    component: EquiposView
  },
  {
    path: '/misiones',
    name: 'misiones',
    component: MisionesView
  },
  {
    path: '/operativos',
    name: 'operativos',
    component: OperativosView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
