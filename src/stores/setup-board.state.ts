import type { StateEvent } from "./events"
import type { SetState } from "./game-state.store";

import { useSetupBoardStore } from "./setup-board.store";
import { stateMachine } from "./state-machine";
import { useGameDataStore } from "./game-data.store";

// type EventSB<Action extends string, Data> = Event<`setup_board_${Action}`, Data>;

interface Event<Action extends string, Data> extends StateEvent<"setup_board", Action, Data> {
    type: `setup_board:${Action}`,
    data: Data;
}

type SetupBoardStateEvent =
    Event<"place_token", { tokenId: string; tileIndex: number; }>;

function createSetupBoardState(setState: SetState) {
    const setupBoardStore = useSetupBoardStore();
    const gameDataStore = useGameDataStore();

    return stateMachine<SetupBoardStateEvent>({
        handlers: {
            "setup_board:place_token"({ tokenId, tileIndex }) {
                
            }
        }
    })
}

type SetupBoardState = ReturnType<typeof createSetupBoardState>;

export { createSetupBoardState };
export type { SetupBoardStateEvent, SetupBoardState };
