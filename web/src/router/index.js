import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'index',
            component: () => import('@/views/cIndex.vue')
        },
        {
            path: '/encrypt',
            name: 'encrypt',
            component: () => import('@/views/cEncrypt.vue')
        },
        {
            path: '/decrypt',
            name: 'decrypt',
            component: () => import('@/views/cDecrypt.vue')
        }
    ]
})

export default router
