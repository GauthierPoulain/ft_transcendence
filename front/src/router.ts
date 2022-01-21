import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Home from './views/home/index.vue';
import Auth from './views/auth/index.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/auth',
    component: Auth,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
