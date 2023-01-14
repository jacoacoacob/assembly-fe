import { defineStore } from "pinia";
import { ref } from "vue";

import type { Game } from "./game";

const useGameStore = defineStore("game", () => {
    const name = ref<Game["name"]>("");
    const history = ref<Game["history"]>([])
    const players = ref<Game["players"]>([]);

    return { name, history, players };
});

export { useGameStore };
