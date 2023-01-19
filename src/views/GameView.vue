<script setup lang="ts">
import { provide, ref } from 'vue';
import TheBoard from '@/components/TheBoard.vue';
import TheSidePanel from '@/components/TheSidePanel.vue';
import { useGameStateStore } from '@/stores/game-state-store';

const gameState = useGameStateStore();

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

provide("board:dragleave", (event: DragEvent) => {
    event.preventDefault();
    hoveredTile.value = -1;
});

provide("tile:dragenter", (event: DragEvent) => {
    event.preventDefault();
    const target = (event.target as HTMLDivElement);
    const tileIndex = findTileIndex(target);
    if (tileIndex) {
        hoveredTile.value = tileIndex;
    }
});

provide("tile:dragover", (event: DragEvent) => {
    event.preventDefault();
});

provide("tile:drop", (event: DragEvent) => {
    event.preventDefault();
    const target = (event.target as HTMLDivElement);
    const tileIndex = findTileIndex(target) ;
    const tokenId = event.dataTransfer?.getData("text");
    if (typeof tileIndex === "number" && tokenId) {
        gameState.pushEvent("setup_board:move_token", { tileIndex, tokenId });
    }
    activeToken.value = "";
    hoveredTile.value = -1;
});
</script>

<template>
    <div class="flex space-x-8 w-full px-8">
        <TheBoard />
        <TheSidePanel class="flex-1 w-full" />
    </div>
</template>