import { defineStore } from "pinia";
import { computed } from "vue";
import { selectRandomFrom } from "@/utils/rand";
import { useEventsStore } from "../events.store";
import { useGameDataStore } from "../game-data.store";
import { usePlayersStore } from "../players.store";
import { useTilesStore } from "../tiles.store";
import { useTokensStore } from "../tokens.store";
import { useScoring } from "../../composables/use-scoring";
import { usePlayerActionsStore } from "../player-actions.store";
import { useMoveTokenStore } from "../move-token.store";

/**
 * Methods and data to be used in components when gameState.currentState === "place_tokens"
 */
const usePlaceTokensState = defineStore("place-tokens-state", () => {
    const gameData = useGameDataStore();
    const events = useEventsStore();
    const tokens = useTokensStore();
    const players = usePlayersStore();
    const tiles = useTilesStore();
    const scoring = useScoring();
    const actions = usePlayerActionsStore();

    const moveToken = useMoveTokenStore();

    const isTurnEndable = computed(() => Boolean(moveToken.candidateId));

    function startMove(tokenId: string) {
        moveToken.pickup(tokenId);
    }

    function endMove(tokenId: string, tileIndex: number) {
        // moveToken.drop(tileIndex);
    }

    const helpMessage = computed(() => {
        if (isTurnEndable.value) {
            return 'Hit the spacebar or click the "end turn" button to end your turn.'
        }
        return "Move a token from your reserve to an open tile on the board."
    });

    function _isPlacementComplete() {
        const inPlayReserveTokens = tokens.inPlayTokenIds.filter(
            (tokenId) => tokens.reserveTokenIds.includes(tokenId)
        );
        return inPlayReserveTokens.length === 0;
    }

    function _startPlayState() {
        events.sendMany(
            ["game_state:set_state", "play"],
            ["tiles:set_in_play_tiles", gameData.tiles.map((_, i) => i)],
            ["tokens:set_in_play_token_ids", Object.keys(gameData.tokens)],
            ["scores:set_points", scoring.calculatePoints()]
        );
    }

    function endTurn() {
        if (!isTurnEndable.value) {
            return;
        }
        moveToken.commit()
        events.sendMany(["players:next"]);
        players.viewActivePlayer();
        if (_isPlacementComplete()) {
            _startPlayState();
        } else if (!actions.canPlaceToken) {
            events.send(
                "tiles:set_in_play_tiles",
                tiles.inPlayTiles.concat(
                    selectRandomFrom(
                        tiles.openTiles.filter(
                            (tileIndex) => !tiles.openInPlayTiles.includes(tileIndex)
                        ),
                        2
                    )
                )
            )
        }
    }

    return { startMove, endMove, endTurn, isTurnEndable, helpMessage };
})

export { usePlaceTokensState };
