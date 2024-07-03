import { createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'index',
            component: () => import('@/views/cIndex.vue')
        },
        {
            path: '/keys',
            name: 'keys',
            component: () => import('@/views/cKeys.vue')
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
