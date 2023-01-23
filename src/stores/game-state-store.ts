import { defineStore } from "pinia";
import { ref } from "vue";

import { saveGame } from "@/api/game-api";
import { useGameDataStore } from "./game-data-store";
import { createPlaceTokensState, type PlaceTokensState } from "../states/place-tokens-state";
import { createInitialState, type InitialState } from "../states/initial-state";
import type { Game, GameEvent } from "./game-data-store-types";
import type { StateMachine } from "../utils/state-machine";
import type { NSEvent } from "@/utils/state-events";

type StateName = 
    "initial" |
    "place_tokens" |
    "play_game";

type SetState = (newState: StateName) => void;

type State = PlaceTokensState | InitialState;

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
            handleEvent(event);
        });
    }

    const states: Record<StateName, PlaceTokensState | InitialState> = {
        initial: createInitialState(setState),
        place_tokens: createPlaceTokensState(setState),
        play_game: createInitialState(setState),
    };

    function handleEvent<S extends StateName, E extends NSEvent<S, string>>(event: E) {
        const state = states[currentState.value];
        (state.handleEvent as StateMachine<S, E>["handleEvent"])(event);
        game.history.push(event as GameEvent);
    }

    function setState(newState: StateName) {
        states[currentState.value].teardown();
        currentState.value = newState;
        states[currentState.value].setup();
    }

    function pushEvent<E extends GameEvent>(type: E["type"], data: E["data"] = {}) {
        const [namespace, action] = type.split(":");
        const event = { type, data, action, namespace } as GameEvent;
        handleEvent(event);
        saveGame(game.$state);
    }

    return { currentState, resetState, pushEvent, loadHistory };
});

export { useGameStateStore };
export type { SetState, StateName };
