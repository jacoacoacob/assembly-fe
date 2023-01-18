import type { Event } from "./events"
import type { SetState } from "../stores/game-state-store";

import { useSetupBoardStore } from "../stores/setup-board-store";
import { stateMachine } from "./state-machine";
import { useGameDataStore } from "../stores/game-data-store";

type SetupBoardStateEvent =
    Event<"move_token", { tokenId: string; tileIndex: number; }>;

function createSetupBoardState(setState: SetState) {
    const setupBoardStore = useSetupBoardStore();
    const gameDataStore = useGameDataStore();

    return stateMachine<SetupBoardStateEvent>({
        handlers: {
            move_token({ tokenId, tileIndex }) {
                gameDataStore.moveToken(tokenId, tileIndex);
            }
        },
        setup() {
            // setupBoardStore.
        }
    })
}

type SetupBoardState = ReturnType<typeof createSetupBoardState>;

export { createSetupBoardState };
export type { SetupBoardStateEvent, SetupBoardState };
