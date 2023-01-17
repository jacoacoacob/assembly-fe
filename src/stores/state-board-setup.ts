import type { Event, EventHandlers } from "./events"
import { createStateMachine } from "./state-machine"
import type { SetState } from "./state-machine";
import type { StateName } from "./game-state.store";
import type { GameDataStore } from "./game-data.store";

type BoardSetupEvent =
    Event<"doths"> |
    Event<"place_token", { tokenId: string; tileIndex: number; }>;

interface LocalData {
    activePlayer: number;
}

function createBoardSetupState(setState: SetState<StateName>) {
    return createStateMachine<BoardSetupEvent, GameDataStore, LocalData>({
        localData: {
            activePlayer: 0,
        },
        handlers: {
            place_token({ store, localData }, { tileIndex, tokenId }) {
                localData.value
            },
            doths({ store, localData }) {

            }
        },
        setup({ store, localData }) {

        },
    })
}


export {}
