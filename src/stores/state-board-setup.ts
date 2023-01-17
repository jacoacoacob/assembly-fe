import type { Event } from "./events"
import { stateMachine } from "./state-machine"
import type { SetState, State } from "./state-machine";
import type { StateName } from "./game-state.store";
import type { GameDataStore } from "./game-data.store";

type BoardSetupStateEvent =
    Event<"place_token", { tokenId: string; tileIndex: number; }>;

interface LocalData {
    activePlayer: number;
}

type BoardSetupState = State<BoardSetupStateEvent, GameDataStore>;

function createBoardSetupState(setState: SetState<StateName>): BoardSetupState {
    return stateMachine<BoardSetupStateEvent, GameDataStore>({
        handlers: {
            place_token({ store }, { tileIndex, tokenId }) {
                
            },
        },
        setup({ store, localData }) {

        },
    })
}


export { createBoardSetupState };
export type { BoardSetupState, BoardSetupStateEvent };
