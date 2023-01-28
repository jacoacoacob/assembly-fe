 import { createRouter, createWebHistory, type RouteParams, type RouterLinkProps } from "vue-router";

import SavedGamesView from "@/views/SavedGamesView.vue";
import NewGameView from "@/views/NewGameView.vue";
import WelcomeView from "@/views/WelcomeView.vue";
import GameView from "@/views/GameView.vue";
import { loadGameHistory } from "./api/game-api";
import { useEventsStore } from "./stores-v2/events.store";
import { useGameDataStore } from "./stores-v2/game-data.store";
import { useGameStateStore } from "./stores-v2/game-state.store";

interface Breadcrumb {
    name: string | ((params: RouteParams) => string);
    to?: RouterLinkProps["to"];
}

declare module "vue-router" {
    interface RouteMeta {
        breadcrumbs: Breadcrumb[];
    }
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "welcome",
            component: WelcomeView,
            meta: {
                breadcrumbs: [
                    {
                        name: "Home"
                    }
                ]
            }
        },
        {
            path: "/new-game",
            name: "new-game",
            component: NewGameView,
            beforeEnter() {
                const gameData = useGameDataStore();
                const gameState = useGameStateStore();
                gameData.$reset();
                gameState.currentState = "new_game";
            },
            meta: {
                breadcrumbs: [
                    {
                        name: "Home",
                        to: "/"
                    },
                    {
                        name: "New Game"
                    },
                ]
            }
        },
        {
            path: "/saved-games",
            name: "saved-games",
            component: SavedGamesView,
            meta: {
                breadcrumbs: [
                    {
                        name: "Home",
                        to: "/"
                    },
                    {
                        name: "Saved Games"
                    },
                ]
            }
        },
        {
            path: "/game/:name?",
            name: "game",
            component: GameView,
            beforeEnter(to) {
                const events = useEventsStore();
                const gameHistory = loadGameHistory(to.params.name as string);
                if (gameHistory) {
                    events.loadHistory(gameHistory);
                }
            },
            meta: {
                breadcrumbs: [
                    {
                        name: "Home",
                        to: "/"
                    },
                    {
                        name: (params) => `Game: ${params.name}`,
                    },
                ]
            }
        }
    ],
});

export { router };
