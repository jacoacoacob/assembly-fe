import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

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

// type State = SetupBoardState | InitialState;

const useGameStateStore = defineStore("game-state", () => {

    const game = useGameDataStore();

    const currentState = ref<StateName>("initial");

    function resetState() {
        currentState.value = "initial";
        game.$reset();
    }

    function loadHistory(history: Game["history"]) {
        game.$reset();
        currentState.value = "initial";
        history.forEach(event => {
            console.log(event)
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
        console.log("[setState]", newState);
        states[currentState.value].teardown();
        currentState.value = newState;
        setTimeout(() => {
            states[currentState.value].setup();
        })
    }

    function pushEvent<E extends GameEvent>(event: E) {
        handleEvent(event);
        saveGame(game.$state);
    }

    return { currentState, resetState, pushEvent, loadHistory };
});

export { useGameStateStore };
export type { SetState, StateName };
