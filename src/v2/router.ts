import { createRouter, createWebHistory, type RouteParams, type RouterLinkProps } from "vue-router";

import HomePage from "@/v2/views/HomePage.vue";
import GameContainerPage from "@/v2/views/GameContainerPage.vue";
import GameLobbyPage from "@/v2/views/GameLobbyPage.vue";
import GamePlayPage from "@/v2/views/GamePlayPage.vue";
import GameRulesPage from "@/v2/views/GameRulesPage.vue";

interface Breadcrumb {
    name: string | ((params: RouteParams) => string);
    to?: RouterLinkProps["to"];
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "",
            name: "home-page",
            component: HomePage,
        },
        {
            path: "/:gameLinkId",
            component: GameContainerPage,
            children: [
                {
                    path: "",
                    name: "game-lobby",
                    component: GameLobbyPage
                },
                {
                    path: "play",
                    name: "game-play",
                    component: GamePlayPage
                },
                {
                    path: "rules",
                    name: "game-rules",
                    component: GameRulesPage,
                },
            ],
        },
    ],
});

export { router }