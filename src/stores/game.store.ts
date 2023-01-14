import { defineStore } from "pinia";

import type { Game } from "./game";

const useGameStore = defineStore("game", {
    state: () => ({
        name: "",
        history: [] as Game["history"],
        players: [] as Game["players"],
    }),
});

export { useGameStore };
