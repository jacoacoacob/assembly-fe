import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { useGameStateStore } from "./game-state.store";
import { useGameDataStore } from "./game-data.store";
import { usePlayersStore } from "./players.store";
import { useScoresStore } from "./scores.store";
import { useTokensStore } from "./tokens.store";
import { useEventsStore } from "./events.store";
import { useTilesStore } from "./tiles.store";
import { useMoveValidationStore } from "./move-validation.store";
import { useMovesDetails } from "@/composables/use-move-details";


const PLACE_TOKEN_COST = 1;

type MoveKind = "place_token" | "move_token" | "remove_token";

interface CommittedMove {
    origin: number;
    dest: number;
    tokenValue: number;
}

const usePlayerMovesStore = defineStore("player-moves", () => {
    const gameState = useGameStateStore();
    const gameData = useGameDataStore();
    const players = usePlayersStore();
    const scores = useScoresStore();
    const tokens = useTokensStore();
    const events = useEventsStore();
    const tiles = useTilesStore();
    const validation = useMoveValidationStore();

    const committedMoves = ref<CommittedMove[]>([]);

    const committedMovesDetails = useMovesDetails(committedMoves);

    const placeToken = computed(() => {
        if (players.activePlayer) {
            const activePlayerId = players.activePlayer.id;
            const playerPoints = scores.pointTotals[activePlayerId];
            const eligableTokens = tokens.inPlayReservePlayerTokenIds[activePlayerId];
            const eligableTiles = tiles.openInPlayTiles;
            
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
            
        }
        return {
            eligableTiles: [],
            eligableTokens: [],
        }
    });

    const moveToken = computed(() => {
        if (players.activePlayer) {
            const activePlayerId = players.activePlayer.id;
            const playerPoints = scores.pointTotals[activePlayerId];
            const eligableTokens = tokens.inPlayReservePlayerTokenIds[activePlayerId];
            const eligableTiles = tiles.openInPlayTiles;
            return {
                eligableTiles,
                eligableTokens,
            };
        }
        return {
            eligableTiles: [],
            eligableTokens: [],
        };
    });
    
    const removeToken = computed(() => {
        if (players.activePlayer) {
            const activePlayerId = players.activePlayer.id;
            return {
                eligableTokens: tokens.onBoardPlayerTokenIds[activePlayerId],
            };
        }
        return {
            eligableTokens: []
        }
    })

    const canPlaceToken = computed(() => placeToken.value.eligableTokens.length > 0);
    const canMoveToken = computed(() => moveToken.value.eligableTokens.length > 0);
    const canRemoveToken = computed(() => removeToken.value.eligableTokens.length > 0);

    const availableMoveKinds = computed(
        (): MoveKind[] => [
            canPlaceToken.value && "place_token",
            canMoveToken.value && "move_token",
            canRemoveToken.value && "remove_token",
        ].filter(Boolean) as MoveKind[]
    )

    return {
        availableMoveKinds,
        canMoveToken,
        canPlaceToken,
        canRemoveToken,
        committedMoves,
        committedMovesDetails,
        moveToken,
        placeToken,
        removeToken,
    };
});

export { usePlayerMovesStore };
export type { MoveKind, CommittedMove };


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