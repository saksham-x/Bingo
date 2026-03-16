import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LoginPage from '@/pages/LoginPage.vue';
import LobbyPage from '@/pages/LobbyPage.vue';
import RoomPage from '@/pages/RoomPage.vue';
import GamePage from '@/pages/GamePage.vue';
import ResultPage from '@/pages/ResultPage.vue';
const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginPage, meta: { requiresAuth: false } },
    { path: '/lobby', component: LobbyPage, meta: { requiresAuth: true } },
    { path: '/room/:code', component: RoomPage, meta: { requiresAuth: true } },
    { path: '/game/:code', component: GamePage, meta: { requiresAuth: true } },
    { path: '/result/:code', component: ResultPage, meta: { requiresAuth: true } },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});
// Wait for auth to resolve before first navigation
function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
}
router.beforeEach(async (to) => {
    const user = await getCurrentUser();
    if (to.meta.requiresAuth && !user) {
        return '/login';
    }
    if (to.path === '/login' && user) {
        return '/lobby';
    }
});
export default router;
