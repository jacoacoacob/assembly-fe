import { defineStore } from "pinia";
import { ref } from "vue";

type GameState = "new_game" | "place_tokens" | "play" | "final"; 

const useGameStateStore = defineStore("game-state", () => {
    const currentState = ref<GameState>("new_game");

    return { currentState };
});

export { useGameStateStore };
export type { GameState };
