import type { Event } from "./events"
import type { SetState } from "./game-state.store";

import { useSetupBoardStore } from "./setup-board.store";
import { stateMachine } from "./state-machine";
import { useGameDataStore } from "./game-data.store";

type BoardSetupStateEvent =
    Event<"place_token", { tokenId: string; tileIndex: number; }>;

function createSetupBoardState(setState: SetState) {
    const setupBoardStore = useSetupBoardStore();
    const gameData = useGameDataStore();

    return stateMachine<BoardSetupStateEvent>({
        handlers: {
            place_token({ tokenId, tileIndex }) {
                
            }
        }
    })
}

type SetupBoardState = ReturnType<typeof createSetupBoardState>;

export { createSetupBoardState };
export type { BoardSetupStateEvent, SetupBoardState };
