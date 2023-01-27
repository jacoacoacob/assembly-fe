import { selectRandomFrom } from "@/utils/rand";
import { defineStore } from "pinia";
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

    function startMove(tokenId: string) {
        if (tokenId !== tokens.candidateId) {
            events.send("tokens:set_candidate_id", tokenId);
        }
    }

    function endMove(tokenId: string, tileIndex: number) {
        const token = gameData.tokens[tokenId];
        if (token.tileIndex === -1 && token.tileIndex === tileIndex) {
            events.send("tokens:set_candidate_id", "");
        }
        if (token.tileIndex !== tileIndex) {
            events.send("tokens:move_token", { tokenId, tileIndex });
            if (tileIndex === -1) {
                events.send("tokens:set_candidate_id", "");
            }
        }
    }

    function _isPlacementComplete() {
        const inPlayReserveTokens = tokens.inPlayTokenIds.filter(
            (tokenId) => tokens.reserveTokenIds.includes(tokenId)
        );
        return inPlayReserveTokens.length === 0;
    }

    function endTurn() {
        events.sendMany(["players:next"], ["tokens:set_candidate_id", ""]);
        players.viewActivePlayer();
        const playerHasMove =
            tokens.availableReservePlayerTokenIds[players.activePlayer.id].length > 0;
        if (_isPlacementComplete()) {
            events.send("game_state:set_state", "play");
        } else if (!playerHasMove) {
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

    return { startMove, endMove, endTurn };
})

export { usePlaceTokensState };
