// import { useBoardDataStore } from "@/stores/board-data-store";
// import { useGameDataStore } from "@/stores/game-data-store";
// import { useGameStateStore } from "@/stores/game-state-store";
// import { usePlaceTokensStore } from "@/stores/place-tokens-store";
// import { usePlayersDataStore } from "@/stores/players-data-store";
// import { selectRandomFrom } from "@/utils/rand";

// function usePlaceTokensActions() {
//     const gameState = useGameStateStore();
//     const gameData = useGameDataStore();
//     const boardData = useBoardDataStore();
//     const playersData = usePlayersDataStore();
//     const placeTokensState = usePlaceTokensStore();

//     function _isPlacementComplete() {
//         return Object.values(placeTokens.reserveTokens).every(tokenIds => tokenIds.length === 0);
//     }

//     function endTurn() {
//         gameState.pushEvent("place_tokens:next_player");
//         gameState.pushEvent("place_tokens:set_candidate_token", { tokenId: "" });
//         playersData.setViewedPlayer(playersData.activePlayerIndex);
//         if (_isPlacementComplete()) {
//             gameState.pushEvent("place_tokens:finish");
//         } else if (!boardData.playerHasMove(playersData.activePlayer.id)) {
//                 gameState.pushEvent(
//                     "place_tokens:add_in_play_tiles",
//                     selectRandomFrom(
//                         gameData.tiles
//                             .map((_, i) => i)
//                             .filter((i) => !placeTokens.openTiles.includes(i)),
//                         2
//                     )
//                 );
//             }

//     }

//     return { endTurn };
// }

// export { usePlaceTokensActions };
export {};

