import type { NSEvent } from "../utils/state-events"
import { useGameStateStore, type SetState } from "../stores/game-state-store";

import { useBoardSetupStore } from "../stores/board-setup-store";
import { stateMachine } from "../utils/state-machine";
import { useGameDataStore } from "../stores/game-data-store";
import type { Player, Token } from "@/stores/game-data-store-types";

type Event<Action extends string, Data = {}> = NSEvent<"setup_board", Action, Data>;

type SetupBoardStateEvent =
    Event<"set_staged_tokens", Record<Player["id"], Token["id"][]>> |
    Event<"end_turn"> |
    Event<"move_token", { tokenId: string; tileIndex: number; }>;

function createSetupBoardState(setState: SetState) {
    const boardSetup = useBoardSetupStore();
    const gameData = useGameDataStore();
    const gameState = useGameStateStore();

    return stateMachine<"setup_board", SetupBoardStateEvent>({
        handlers: {
            move_token({ tokenId, tileIndex }) {
                gameData.moveToken(tokenId, tileIndex);
            },
            end_turn() {
                boardSetup.endTurn();
            },
            set_staged_tokens(stagedTokens) {
                boardSetup.stagedTokens = stagedTokens;
            }
        },
    })
}


type SetupBoardState = ReturnType<typeof createSetupBoardState>;

export { createSetupBoardState };
export type { SetupBoardStateEvent, SetupBoardState };
