import type { NSEvent } from "../utils/state-events"
import { useGameStateStore, type SetState } from "../stores/game-state-store";

import { usePlaceTokensStore } from "../stores/place-tokens-store";
import { stateMachine } from "../utils/state-machine";
import { useGameDataStore } from "../stores/game-data-store";
import type { Player, Token } from "@/stores/game-data-store-types";

type Event<Action extends string, Data = {}> = NSEvent<"place_tokens", Action, Data>;

type PlaceTokensEvent =
    Event<"set_staged_tokens", Record<Player["id"], Token["id"][]>> |
    Event<"add_in_play_tile", { tileIndex: number }> |
    Event<"end_turn"> |
    Event<"move_token", { tokenId: string; tileIndex: number; }>;

function createPlaceTokensState(setState: SetState) {
    const placeTokensStore = usePlaceTokensStore();
    const gameData = useGameDataStore();
    const gameState = useGameStateStore();

    return stateMachine<"place_tokens", PlaceTokensEvent>({
        handlers: {
            move_token({ tokenId, tileIndex }) {
                gameData.moveToken(tokenId, tileIndex);
            },
            end_turn() {
                placeTokensStore.endTurn();
            },
            set_staged_tokens(stagedTokens) {
                placeTokensStore.stagedTokens = stagedTokens;
            },
            add_in_play_tile({ tileIndex }) {
                if (!placeTokensStore.inPlayTiles.includes(tileIndex)) {
                    placeTokensStore.inPlayTiles.push(tileIndex);
                }
            }
        },
    })
}


type PlaceTokensState = ReturnType<typeof createPlaceTokensState>;

export { createPlaceTokensState };
export type { PlaceTokensEvent, PlaceTokensState };
