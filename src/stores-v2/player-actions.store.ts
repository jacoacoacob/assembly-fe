import { defineStore } from "pinia";
import { computed } from "vue";

import { useGameStateStore } from "./game-state.store";
import { useGameDataStore } from "./game-data.store";
import { usePlayersStore } from "./players.store";
import { useScoresStore } from "./scores.store";
import { useTokensStore } from "./tokens.store";
import { useEventsStore } from "./events.store";
import { useTilesStore } from "./tiles.store";

const PLACE_TOKEN_COST = 1;

type PlayerAction = "place_token" | "move_token" | "remove_token";

const usePlayerActionsStore = defineStore("player-actions", () => {
    const gameState = useGameStateStore();
    const gameData = useGameDataStore();
    const players = usePlayersStore();
    const scores = useScoresStore();
    const tokens = useTokensStore();
    const events = useEventsStore();
    const tiles = useTilesStore();

    const placeToken = computed(() => {
        const activePlayerId = players.activePlayer.id;
        const playerPoints = scores.points[activePlayerId];
        const eligableTokens = tokens.availableReservePlayerTokenIds[activePlayerId];
        const eligableTiles = tiles.openTiles;
        
        if (gameState.currentState === "place_tokens") {
            return { eligableTokens, eligableTiles };
        }
        
        if (gameState.currentState === "play") {
            return {
                eligableTiles,
                // eligableTokens,
                eligableTokens: playerPoints - PLACE_TOKEN_COST > 0 ? eligableTokens : [],
            }
        }
        
        return {
            eligableTiles: [],
            eligableTokens: [],
        }
    });

    const moveToken = computed(() => {
        const activePlayerId = players.activePlayer.id;
        const playerPoints = scores.points[activePlayerId];
        const eligableTokens = tokens.availableReservePlayerTokenIds[activePlayerId];
        const eligableTiles = tiles.openTiles;
        return {
            eligableTiles,
            eligableTokens,
        };
    });
    
    const removeToken = computed(() => {
        return {
            eligableTokens: [],
        };
    })

    const canPlaceToken = computed(() => placeToken.value.eligableTokens.length > 0);
    const canMoveToken = computed(() => moveToken.value.eligableTokens.length > 0);
    const canRemoveToken = computed(() => removeToken.value.eligableTokens.length > 0);

    return {
        canMoveToken,
        canPlaceToken,
        canRemoveToken,
        moveToken,
        placeToken,
        removeToken,
    };
});

export { usePlayerActionsStore };
export type { PlayerAction };


/**
 * ### Actions
 * - `place_token`: spend points to move a token from the reserve onto the board.
 * - `move_token`: spend points to move a token from one tile on the board to another tile.
 * - `remove_token`: get points by removing a token from the board and putting it in the reserve.
 * 
 * ### Requirements
 * - `place_tokens`
 *      - a player's points would not be reduced to 0 or below.
 *      - there is an open tile
 * - `move_token`
 *      - a player's points would not be reduced to 0 or below.
 *      - there is an open tile.
 * - `remove_token`
 *      - this action is always available. As
 */