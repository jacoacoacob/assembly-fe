import { defineStore } from "pinia";
import { ref } from "vue";

import { saveGame } from "@/api/game-api";
import { useGameDataStore } from "./game-data.store";
import { createBoardSetupState, type BoardSetupState } from "./state-board-setup";

type StateName = 
    // "initial" |
    "board_setup";
    // "player_turns";

const useGameStateStore = defineStore("game-state", () => {

    const game = useGameDataStore();

    const currentState = ref<StateName>("board_setup");

    function setState(newState: StateName) {
        states[currentState.value].teardown(game);
        currentState.value = newState;
        states[currentState.value].setup(game);
    }


    type State = BoardSetupState;

    const states: Record<StateName, State> = {
        board_setup: createBoardSetupState(setState),

    };

    game.$onAction(({ name, args }) => {
        if (name === "pushEvent") {
            const [event] = args;
            states[currentState.value].handleEvent(game, event);
            saveGame(game.$state);
        }
    });


    return { currentState };
});

export { useGameStateStore };
export type { StateName };

/*
CREATE GAME
- add/edit name
- add/edit/remove players

SETUP BOARD
- players move tokens onto board with tile thresholds hidden

START GAME
-

*/
