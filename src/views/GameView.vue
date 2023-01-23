<script setup lang="ts">
import { provide, ref } from 'vue';
import TheBoard from '@/components/TheBoard.vue';
import TheSidePanel from '@/components/TheSidePanel.vue';
import { useGameStateStore } from '@/stores/game-state-store';
// import { useBoard } from '@/composables/use-board';
import TopBar from '@/components/TopBar.vue';
import { usePlayerStore } from '@/stores/player-store';
import { useTileDataStore } from '@/stores/tile-data-store';
import { useGameDataStore } from "@/stores/game-data-store";
import { usePlaceTokensStore } from '@/stores/place-tokens-store';
import { randFromRange } from '@/utils/rand';


const placeTokensStore = usePlaceTokensStore();
const gameData = useGameDataStore()
const gameState = useGameStateStore();
const playerStore = usePlayerStore();

const tiles = useTileDataStore();

const activeToken = ref<string>("");
const hoveredTile = ref<number>(-1);

provide("board:activeToken", activeToken);
provide("board:hoveredTile", hoveredTile);

provide("token:dragstart", (event: DragEvent) => {
    const tokenId = (event.target as HTMLDivElement).id;
    if (event.dataTransfer) {
        event.dataTransfer.setData("text", tokenId);
        activeToken.value = tokenId;
    }
});

function findTileIndex(element: HTMLElement) {
    let current = element;
    while (current.parentElement) {
        if (current.dataset.tileIndex) {
            return Number.parseInt(current.dataset.tileIndex);
        }
        current = current.parentElement;
    }
    return null;
}

// function isTileDroppable(tileIndex: number) {
//     return board.openTiles.value.includes(tileIndex);
// }

provide("board:dragleave", (event: DragEvent) => {
    event.preventDefault();
    hoveredTile.value = -1;
});

provide("tile:dragenter", (event: DragEvent) => {
    event.preventDefault();
    const target = (event.target as HTMLDivElement);
    const tileIndex = findTileIndex(target);
    if (tileIndex && tiles.isValidMove(tileIndex, activeToken.value)) {
        hoveredTile.value = tileIndex;
    }
});

provide("tile:dragover", (event: DragEvent) => {
    event.preventDefault();
});



provide("tile:drop", (event: DragEvent) => {
    event.preventDefault();
    const target = (event.target as HTMLDivElement);
    const tileIndex = findTileIndex(target);
    const tokenId = event.dataTransfer?.getData("text");
    if (typeof tileIndex === "number" && tokenId && tiles.isValidMove(tileIndex, tokenId)) {
        if (gameState.currentState === "place_tokens") {

            function playerHasMove() {
                const playerTokens = placeTokensStore.stagedTokens[playerStore.activePlayer.id]
                    .map((tokenId) => gameData.tokens[tokenId])
                    .filter((token) => token.tileIndex === -1);

                return playerTokens.some(
                    (token) => tiles.openTiles.some(
                        (tileIndex) => tiles.isValidMove(tileIndex, token.id)
                    )
                );
            }

            gameState.pushEvent("place_tokens:move_token", { tileIndex, tokenId });
            gameState.pushEvent("place_tokens:end_turn");
            playerStore.setViewedPlayer(playerStore.activePlayerIndex);
            // if new active player has no open tiles available, open up a random one
            if (!playerHasMove()) {
                
                const indices = gameData.tiles
                    .map((_, i) => i)
                    .filter((i) => !placeTokensStore.openTiles.includes(i));
                
                gameState.pushEvent(
                    "place_tokens:add_in_play_tile",
                    {
                        tileIndex: indices[randFromRange(0, indices.length)]
                    }
                )

            }
        }
    }
    activeToken.value = "";
    hoveredTile.value = -1;
});

function onDrop(event: DragEvent) {
    event.preventDefault();
    const target = event.target as HTMLDivElement;
    const tileIndex = findTileIndex(target);
    if (typeof tileIndex === "number" && tiles.isValidMove(tileIndex, activeToken.value)) {

    }
}

</script>

<template>
    <div class="px-8 w-full space-y-4">
        <TopBar />
        <div class="flex space-x-8">
            <TheBoard />
            <TheSidePanel class="flex-1 w-full" />
        </div>
    </div>
</template>