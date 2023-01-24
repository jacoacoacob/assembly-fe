import { useBoardDataStore } from "@/stores/board-data-store";
import { useGameDataStore } from "@/stores/game-data-store";
import { useGameStateStore } from "@/stores/game-state-store";
import { usePlaceTokensStore } from "@/stores/place-tokens-store";
import { usePlayerDataStore } from "@/stores/player-data-store";
import { selectRandomFrom } from "@/utils/rand";

function usePlaceTokensActions() {
    const gameState = useGameStateStore();
    const gameData = useGameDataStore();
    const boardData = useBoardDataStore();
    const playerData = usePlayerDataStore();
    const placeTokens = usePlaceTokensStore();

    function _isPlacementComplete() {
        return Object.values(placeTokens.reserveTokens).every(tokenIds => tokenIds.length === 0);
    }

    function endTurn() {
        gameState.pushEvent("place_tokens:next_player");
        gameState.pushEvent("place_tokens:set_candidate_token", { tokenId: "" });
        playerData.setViewedPlayer(playerData.activePlayerIndex);
        if (_isPlacementComplete()) {
            gameState.pushEvent("place_tokens:finish");
        } else if (!boardData.playerHasMove(playerData.activePlayer.id)) {
            gameState.pushEvent(
                "place_tokens:add_in_play_tiles",
                selectRandomFrom(
                    gameData.tiles
                        .map((_, i) => i)
                        .filter((i) => !placeTokens.openTiles.includes(i)),
                    2
                )
            );
        }
    }

    return { endTurn };
}

export { usePlaceTokensActions };
