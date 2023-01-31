import { defineStore } from "pinia";
import { computed } from "vue";

import { useGameStateStore } from "./game-state.store";
import { useGameDataStore } from "./game-data.store";
import { usePlayersStore } from "./players.store";
import { useScoresStore } from "./scores.store";
import { useTokensStore } from "./tokens.store";
import { useEventsStore } from "./events.store";
import { useTilesStore } from "./tiles.store";
import { useMove } from "./composables/use-move";

const PLACE_TOKENS_COST = 1;

type PlayerAction = "place_token" | "move_token" | "remove_token";

const usePlayerActionsStore = defineStore("player-actions", () => {
    const gameState = useGameStateStore();
    const gameData = useGameDataStore();
    const players = usePlayersStore();
    const scores = useScoresStore();
    const tokens = useTokensStore();
    const events = useEventsStore();
    const tiles = useTilesStore();

    const move = useMove();

    const canPlaceToken = computed(() => {
        const playerPoints = scores.points[players.activePlayer.id];
        const availableTokens = tokens.availableReservePlayerTokenIds[players.activePlayer.id];
        if (gameState.currentState === "play") {
            return availableTokens.length > 0 && playerPoints - PLACE_TOKENS_COST > 0;
        }
        if (gameState.currentState === "place_tokens") {
            return availableTokens.length > 0;
        }
        return false;
    });

    const canMoveToken = computed(() => {
        return true;
    });

    const canRemoveToken = computed(() => {
        return false;
    });

    return {
        canPlaceToken,
        canMoveToken,
        canRemoveToken,

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