import { defineStore } from "pinia";
import { computed } from "vue";
import { selectRandomFrom } from "@/utils/rand";
import { useEventsStore } from "../events.store";
import { useGameDataStore } from "../game-data.store";
import { usePlayersStore } from "../players.store";
import { useTilesStore } from "../tiles.store";
import { useTokensStore } from "../tokens.store";

/**
 * Methods and data to be used in components when gameState.currentState === "place_tokens"
 */
const usePlaceTokensState = defineStore("place-tokens-state", () => {
    const gameData = useGameDataStore();
    const events = useEventsStore();
    const tokens = useTokensStore();
    const players = usePlayersStore();
    const tiles = useTilesStore();

    const isTurnEndable = computed(() => {
        const candidateToken = gameData.tokens[tokens.candidateTokenId];
        return (
            Boolean(candidateToken) &&
            candidateToken.playerId === players.activePlayer.id &&
            candidateToken.tileIndex > -1
        );
    });

    function startMove(tokenId: string) {
        if (tokenId !== tokens.candidateTokenId) {
            events.send("tokens:set_candidate_token_id", tokenId);
        }
    }

    function endMove(tokenId: string, tileIndex: number) {
        const token = gameData.tokens[tokenId];
        if (token.tileIndex === -1 && token.tileIndex === tileIndex) {
            events.send("tokens:set_candidate_token_id", "");
        }
        if (token.tileIndex !== tileIndex) {
            events.send("tokens:move_token", { tokenId, tileIndex });
            if (tileIndex === -1) {
                events.send("tokens:set_candidate_token_id", "");
            }
        }
    }

    function _isPlacementComplete() {
        const inPlayReserveTokens = tokens.inPlayTokenIds.filter(
            (tokenId) => tokens.reserveTokenIds.includes(tokenId)
        );
        return inPlayReserveTokens.length === 0;
    }

    function _playerHasMove(playerId: string) {
        const availableReserveTokens = tokens.availableReservePlayerTokenIds[playerId];
        return availableReserveTokens.length > 0;
    }

    function endTurn() {
        events.sendMany(["players:next"], ["tokens:set_candidate_token_id", ""]);
        players.viewActivePlayer();
        if (_isPlacementComplete()) {
            events.send("game_state:set_state", "play");
        } else if (!_playerHasMove(players.activePlayer.id)) {
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

    return { startMove, endMove, endTurn, isTurnEndable };
})

export { usePlaceTokensState };
