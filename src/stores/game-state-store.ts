import { defineStore } from "pinia";
import { ref } from "vue";

import { saveGame } from "@/api/game-api";
import { useGameDataStore } from "./game-data-store";
import { createSetupBoardState, type SetupBoardState } from "../states/setup-board-state";
import { createInitialState, type InitialState } from "../states/initial-state";
import type { Game, GameEvent } from "./data-store-types";

import type { StateMachine } from "../states/state-machine";

type StateName = 
    "initial" |
    "setup_board" |
    "game_play";

type SetState = (newState: StateName) => void;

type State = SetupBoardState | InitialState;

const useGameStateStore = defineStore("game-state", () => {

    const game = useGameDataStore();

    const currentState = ref<StateName>("initial");

    function loadHistory(history: Game["history"]) {
        history.forEach(event => {
            handleEvent(event);
        });
    }

    const states: Record<StateName, SetupBoardState | InitialState> = {
        initial: createInitialState(setState),
        setup_board: createSetupBoardState(setState),
        game_play: createInitialState(setState),
    };

    function handleEvent<E extends GameEvent>(event: E) {
        const state = states[currentState.value];
        (state.handleEvent as StateMachine<E>["handleEvent"])(event);
        game.history.push(event);
    }

    function setState(newState: StateName) {
        states[currentState.value].teardown();
        currentState.value = newState;
        states[currentState.value].setup();
    }

    function pushEvent<E extends GameEvent>(event: E) {
        handleEvent(event);
        saveGame(game.$state);
    }

    return { currentState, pushEvent, loadHistory };
});

export { useGameStateStore };
export type { SetState, StateName };
