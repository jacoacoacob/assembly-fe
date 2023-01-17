import { defineStore } from "pinia";
import { ref } from "vue";

import { saveGame } from "@/api/game-api";
import { useGameDataStore } from "./game-data.store";
import { createSetupBoardState, type SetupBoardState } from "./setup-board.state";
import { createInitialState, type InitialState, type InitialStateEvent } from "./initial.state";
import type { GameEvent } from "./game-data";

type StateName = 
    "initial" |
    "setup_board";
    // "player_turns";

type SetState = (newState: StateName) => void;

type State = SetupBoardState | InitialState;

const useGameStateStore = defineStore("game-state", () => {

    const game = useGameDataStore();

    const currentState = ref<StateName>("setup_board");

    const states: Record<StateName, SetupBoardState | InitialState> = {
        initial: createInitialState(setState),
        setup_board: createSetupBoardState(setState),
    };

    function setState(newState: StateName) {
        states[currentState.value].teardown();
        currentState.value = newState;
        states[currentState.value].setup();
    }

    function pushEvent<E extends GameEvent>(event: E) {
        const state = states[currentState.value];
        (state.handleEvent as ((event: GameEvent) => void))(event);
        game.history.push(event);
        saveGame(game.$state);
    }

    return { currentState, setState, pushEvent };
});

export { useGameStateStore };
export type { SetState, StateName };

/*
CREATE GAME
- add/edit name
- add/edit/remove players

SETUP BOARD
- players move tokens onto board with tile thresholds hidden

START GAME
-

*/
