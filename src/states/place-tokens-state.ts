import type { NSEvent } from "../utils/state-events"
import { useGameStateStore, type SetState } from "../stores/game-state-store";

import { usePlaceTokensStore } from "../stores/place-tokens-store";
import { stateMachine } from "../utils/state-machine";
import { useGameDataStore } from "../stores/game-data-store";
import type { Player, Token } from "@/stores/game-data-store-types";
import { usePlayersDataStore } from "@/stores/players-data-store";

type Event<Action extends string, Data = {}> = NSEvent<"place_tokens", Action, Data>;

type PlaceTokensEvent =
    Event<"finish"> |
    Event<"set_in_play_tokens", Record<Player["id"], Token["id"][]>> |
    Event<"set_candidate_token", { tokenId: string }> |
    Event<"add_in_play_tiles", number[]> |
    Event<"next_player"> |
    Event<"move_token", { tokenId: string; tileIndex: number; }>;

function createPlaceTokensState(setState: SetState) {
    const placeTokens = usePlaceTokensStore();
    const gameData = useGameDataStore();
    const gameState = useGameStateStore();
    const players = usePlayersDataStore();

    return stateMachine<"place_tokens", PlaceTokensEvent>({
        handlers: {
            finish() {
                setState("play_game");
            },
            move_token({ tokenId, tileIndex }) {
                gameData.moveToken(tokenId, tileIndex);
                if (tileIndex === -1) {
                    placeTokens.candidateToken = "";
                }
            },
            next_player() {
                players.nextPlayer();
            },
            set_in_play_tokens(inPlayTokens) {
                placeTokens.inPlayTokens = inPlayTokens;
            },
            set_candidate_token({ tokenId }) {
                placeTokens.candidateToken = tokenId;
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
