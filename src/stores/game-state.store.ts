import { defineStore } from "pinia";
import { ref, type UnwrapRef } from "vue";
import type { Ref } from "vue";

import { useGameDataStore, type GameDataStore } from "./game-data.store";
import type { Player, GameEvent } from "./game-data";
import { saveGame } from "@/api/game-api";

interface Context<Data> {
    data: Ref<UnwrapRef<Data>>;
    game: GameDataStore;
}

interface StateConfig<Data> {
    data?: Data;
    setup?: (context: Context<Data>) => void;
    tick: (context: Context<Data>, event: GameEvent) => void;
    teardown?: (context: Context<Data>) => void;
}

function createStateMachine<Data>(state: StateConfig<Data>) {
    const data = ref<Data>(state.data ?? {} as Data);

    return {
        tick(game: GameDataStore, event: GameEvent) {
            state.tick({ game, data }, event);
        },
        setup(game: GameDataStore) {
            if (state.setup) {
                state.setup({ game, data });
            }
        },
        teardown(game: GameDataStore){
            if (state.teardown) {
                state.teardown({ game, data });
            }
        }
    }
}


interface State {
    setup: (game: GameDataStore) => void;
    tick: (game: GameDataStore, event: GameEvent) => void;
    teardown: (game: GameDataStore) => void;
}

type StateName = "initial" | "board_setup" | "player_turns";


function createStates(setState: (newState: StateName) => void): Record<StateName, State> {
    return {
        initial: createStateMachine({
            tick({ game }, event) {
                const { type, data } = event;
                if (type === "create_game") {

                }
            }
        }),
        board_setup: createStateMachine({
            tick({ game }, event) {

            },
        }),
        player_turns: createStateMachine({
            tick({ game }, event) {

            }
        }),
    }
}

const useGameStateStore = defineStore("game-state", () => {

    const game = useGameDataStore();

    const currentState = ref<StateName>("initial");

    function setState(newState: StateName) {
        states[currentState.value].teardown(game);
        currentState.value = newState;
        states[currentState.value].setup(game);
    }

    const states = createStates(setState);

    game.$onAction(({ name, args }) => {
        if (name === "pushEvent") {
            const [event] = args;
            states[currentState.value].tick(game, event);
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
