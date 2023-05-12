import { createRouter, createWebHistory, type RouteParams, type RouterLinkProps } from "vue-router";

import GamePage from "@/v2/views/GamePage.vue";
import HomePage from "@/v2/views/HomePage.vue";

interface Breadcrumb {
    name: string | ((params: RouteParams) => string);
    to?: RouterLinkProps["to"];
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home-page",
            component: HomePage
        },
        {
            path: "/:gameLinkId",
            name: "game-page",
            component: GamePage
        },
    ],
});

export { router }