import { createRouter, createWebHistory } from 'vue-router';

import home from '@/views/home.vue';

const routes = [
    //--------Main--------
    { path: '/', name: 'home', component: home },
    { path: '/overview', name: 'overview', component: () => import('@/views/overview.vue') },
    { path: '/document', name: 'document', component: () => import('@/views/document.vue') },
    { path: '/project', name: 'project', component: () => import('@/views/project.vue') },
    //--------Sub Main--------
    { path: '/UA01', name: 'UA01', component: () => import('@/views/UA01.vue') },
    { path: '/UA02', name: 'UA02', component: () => import('@/views/UA02.vue') },
    { path: '/PF01', name: 'PF01', component: () => import('@/views/PF01.vue') },
    { path: '/PF02', name: 'PF02', component: () => import('@/views/PF02.vue') },
    { path: '/PF03', name: 'PF03', component: () => import('@/views/PF03.vue') },
    { path: '/PF04', name: 'PF04', component: () => import('@/views/PF04.vue') },
    { path: '/PM01', name: 'PM01', component: () => import('@/views/PM01.vue') },
    { path: '/PM02', name: 'PM02', component: () => import('@/views/PM02.vue'),
        redirect: '/PM02/PD01',
        children : [
            { path: 'PD01', component: () => import('@/views/PD01.vue') },
            { path: 'PD02', component: () => import('@/views/PD02.vue') },
            { path: 'PD03', component: () => import('@/views/PD03.vue') },
            { path: 'PD04', component: () => import('@/views/PD04.vue') },
            { path: 'PD05', component: () => import('@/views/PD05.vue') },
            { path: 'PD06', component: () => import('@/views/PD06.vue') },
        ]
    },
    { path: '/PM03', name: 'PM03', component: () => import('@/views/PM03.vue') },
    { path: '/PM04', name: 'PM04', component: () => import('@/views/PM04.vue') },
    { path: '/PM05', name: 'PM05', component: () => import('@/views/PM05.vue') },

    { path: '/PQ01', name: 'PQ01', component: () => import('@/views/PQ01.vue') },
    { path: '/PQ02', name: 'PQ02', component: () => import('@/views/PQ02.vue') },
    { path: '/PQ03', name: 'PQ03', component: () => import('@/views/PQ03.vue') },

    { path: '/PR01', name: 'PR01', component: () => import('@/views/PR01.vue') },
    { path: '/PR02', name: 'PR02', component: () => import('@/views/PR02.vue') },
    { path: '/PR03', name: 'PR03', component: () => import('@/views/PR03.vue') },
    { path: '/PR04', name: 'PR04', component: () => import('@/views/PR04.vue') },

    { path: '/PS01', name: 'PS01', component: () => import('@/views/PS01.vue') },
    { path: '/PS02', name: 'PS02', component: () => import('@/views/PS02.vue') },
    { path: '/PS03', name: 'PS03', component: () => import('@/views/PS03.vue') },

    { path: '/ED01', name: 'ED01', component: () => import('@/views/ED01.vue') },
    { path: '/ED02', name: 'ED02', component: () => import('@/views/ED02.vue') },

    { path: '/*', redirect: '/' }

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;