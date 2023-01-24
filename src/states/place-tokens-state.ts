import type { NSEvent } from "../utils/state-events"
import { useGameStateStore, type SetState } from "../stores/game-state-store";

import { usePlaceTokensStore } from "../stores/place-tokens-store";
import { stateMachine } from "../utils/state-machine";
import { useGameDataStore } from "../stores/game-data-store";
import type { Player, Token } from "@/stores/game-data-store-types";

type Event<Action extends string, Data = {}> = NSEvent<"place_tokens", Action, Data>;

type PlaceTokensEvent =
    Event<"set_in_play_tokens", Record<Player["id"], Token["id"][]>> |
    Event<"add_in_play_tiles", number[]> |
    Event<"end_turn"> |
    Event<"move_token", { tokenId: string; tileIndex: number; }>;

function createPlaceTokensState(setState: SetState) {
    const placeTokens = usePlaceTokensStore();
    const gameData = useGameDataStore();
    const gameState = useGameStateStore();

    return stateMachine<"place_tokens", PlaceTokensEvent>({
        handlers: {
            move_token({ tokenId, tileIndex }) {
                gameData.moveToken(tokenId, tileIndex);
                if (tileIndex === -1) {
                    placeTokens.candidateToken = "";
                }
            },
            end_turn() {
                placeTokens.endTurn();
            },
            set_in_play_tokens(inPlayTokens) {
                placeTokens.inPlayTokens = inPlayTokens;
            },
            add_in_play_tiles(tileIndeces) {
                tileIndeces.forEach((tileIndex) => {
                    if (!placeTokens.inPlayTiles.includes(tileIndex)) {
                        placeTokens.inPlayTiles.push(tileIndex);
                    }
                })
            }
        },
    })
}


type PlaceTokensState = ReturnType<typeof createPlaceTokensState>;

export { createPlaceTokensState };
export type { PlaceTokensEvent, PlaceTokensState };
