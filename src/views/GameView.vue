<script setup lang="ts">
import { provide, nextTick } from 'vue';
import TheBoard from '@/components/TheBoard.vue';
import TheSidePanel from '@/components/TheSidePanel.vue';
import { useGameStateStore } from '@/stores/game-state-store';
// import { useBoard } from '@/composables/use-board';
import TopBar from '@/components/TopBar.vue';
import { usePlayerDataStore } from '@/stores/player-data-store';
import { useBoardDataStore } from '@/stores/board-data-store';
import { useGameDataStore } from "@/stores/game-data-store";
import { usePlaceTokensStore } from '@/stores/place-tokens-store';
import { randFromRange, selectRandomFrom } from '@/utils/rand';


const placeTokensStore = usePlaceTokensStore();
const gameData = useGameDataStore()
const gameState = useGameStateStore();
const playerData = usePlayerDataStore();

const boardData = useBoardDataStore();

provide("token:dragstart", (event: DragEvent) => {
    const tokenId = (event.target as HTMLDivElement).id;
    if (event.dataTransfer) {
        event.dataTransfer.setData("text", tokenId);
        boardData.activeToken = tokenId;
        placeTokensStore.candidateToken = tokenId;
    }
});

provide("token:dragend", (event: DragEvent) => {
    boardData.activeToken = "";
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


provide("tile:dragexit", (event: DragEvent) => {
    event.preventDefault();
    boardData.hoveredTile = -1;
});

provide("tile:dragenter", (event: DragEvent) => {
    event.preventDefault();
    const target = (event.target as HTMLDivElement);
    const tileIndex = findTileIndex(target);
    if (tileIndex) {
        boardData.hoveredTile = tileIndex;
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
    if (typeof tileIndex === "number" && tokenId && boardData.isValidMove(tileIndex, tokenId)) {
        if (gameState.currentState === "place_tokens") {
            gameState.pushEvent("place_tokens:move_token", { tileIndex, tokenId });
            // if 
            // gameState.pushEvent("place_tokens:end_turn");
            // playerData.setViewedPlayer(playerData.activePlayerIndex);
            // if (!boardData.playerHasMove(playerData.activePlayer.id)) {
            //     gameState.pushEvent(
            //         "place_tokens:add_in_play_tiles",
            //         selectRandomFrom(
            //             gameData.tiles
            //                 .map((_, i) => i)
            //                 .filter((i) => !placeTokensStore.openTiles.includes(i)),
            //             2
            //         )
            //     );
            // }

        }
    }
    boardData.activeToken = "";
    boardData.hoveredTile = -1;
});

function onDrop(event: DragEvent) {
    event.preventDefault();
    const target = event.target as HTMLDivElement;
    const tileIndex = findTileIndex(target);
    if (typeof tileIndex === "number" && boardData.isValidMove(tileIndex, boardData.activeToken)) {

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