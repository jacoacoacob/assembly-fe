import { defineStore } from "pinia";
import { ref } from "vue";

import { saveGame } from "@/api/game-api";
import { useGameDataStore } from "./game-data.store";
import { createSetupBoardState, type SetupBoardState } from "./setup-board.state";
import type { GameEvent } from "./game-data";

type StateName = 
    // "initial" |
    "setup_board";
    // "player_turns";

type SetState = (newState: StateName) => void;

type State = SetupBoardState;

const useGameStateStore = defineStore("game-state", () => {

    const game = useGameDataStore();

    const currentState = ref<StateName>("setup_board");

    const states: Record<StateName, State> = {
        setup_board: createSetupBoardState(setState),
    };

    function setState(newState: StateName) {
        states[currentState.value].teardown();
        currentState.value = newState;
        states[currentState.value].setup();
    }

    function pushEvent(event: GameEvent) {
        states[currentState.value].handleEvent(event);
        game.history.push(event);
        saveGame(game.$state);
    }

    return { currentState, pushEvent };
});

export { useGameStateStore };
export type { SetState };

/*
CREATE GAME
- add/edit name
- add/edit/remove players

SETUP BOARD
- players move tokens onto board with tile thresholds hidden

START GAME
-

*/
