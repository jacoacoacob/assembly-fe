import type { Event } from "./events"
import { useGameStateStore, type SetState } from "../stores/game-state-store";

import { useSetupBoardStore } from "../stores/setup-board-store";
import { stateMachine } from "./state-machine";
import { useGameDataStore, type GameDataStore } from "../stores/game-data-store";
import type { Game, Player, PlayerTokens, Token } from "@/stores/data-store-types";
import { randFromRange } from "@/utils/rand";

type SetupBoardStateEvent =
    Event<"set_staged_tokens", Record<Player["id"], Token["id"][]>> |
    Event<"move_token", { tokenId: string; tileIndex: number; }>;

function createSetupBoardState(setState: SetState) {
    const setupBoardData = useSetupBoardStore();
    const gameData = useGameDataStore();
    const gameState = useGameStateStore();

    function getNextPlayer() {
        const playerIndex = gameData.players.findIndex((player) => player.id === setupBoardData.currentPlayer);
        if (playerIndex < gameData.players.length - 1) {
            return gameData.players[playerIndex + 1].id;
        }
        return gameData.players[0].id;
    }

    return stateMachine<SetupBoardStateEvent>({
        handlers: {
            move_token({ tokenId, tileIndex }) {
                gameData.moveToken(tokenId, tileIndex);
                setupBoardData.currentPlayer = getNextPlayer();
            },
            set_staged_tokens(stagedTokens) {
                setupBoardData.stagedTokens = stagedTokens;
            }
        },
    })
}


type SetupBoardState = ReturnType<typeof createSetupBoardState>;

export { createSetupBoardState };
export type { SetupBoardStateEvent, SetupBoardState };
