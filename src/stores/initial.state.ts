import { stateMachine } from "./state-machine";
import { useGameDataStore } from "./game-data.store";
import type { SetState } from "./game-state.store";
// import type { StateEvent } from "./events"
import type { Event } from "./events"
import type { Player } from "./game-data";


// interface Event<Action extends string, Data> extends StateEvent<"initial", Action, Data> {
//     type: `initial:${Action}`;
//     data: Data;
// } 

type InitialStateEvent = Event<"create_game", { players: Player[], name: string; }>;

// function initialStateEvent<E extends InitialStateEvent>(action: E["action"], data: E["data"]): InitialStateEvent {
//     return {
//         type: `initial:${action}`,
//         action,
//         data
//     }
// }

function createInitialState(setState: SetState) {
    const gameData = useGameDataStore();

    return stateMachine<InitialStateEvent>({
        handlers: {
            create_game({ players, name }) {
                gameData.$patch({ players, name });
                setState("setup_board");
            }
        }
    })
}

type InitialState = ReturnType<typeof createInitialState>;

export { createInitialState };
export type { InitialStateEvent, InitialState };
