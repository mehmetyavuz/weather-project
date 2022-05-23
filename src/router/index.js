import {createRouter, createWebHistory} from "vue-router";
import Register from '@/views/Register.vue'

const routes = [
    {path: '/', name: 'Register', component: Register},
    {
        path: '/weather-forecast',
        name: 'WeatherForecast',
        component: () => import('@/views/WeatherForecast.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router