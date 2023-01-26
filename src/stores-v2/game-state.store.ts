import { defineStore } from "pinia";
import { ref } from "vue";

type GameState = "new_game" | "place_tokens" | "play" | "final"; 

const useGameStateStore = defineStore("game-state", () => {
    
    const currentState = ref<GameState>("new_game");

    return { currentState };
    // function setState(newState: GameState) {
    //     currentState.value = newState;
    // }

    // return { currentState, setState };
});

export { useGameStateStore };
export type { GameState };
