<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import GridTile from './GridTile.vue';
import { useGameDataStore } from '@/stores/game-data.store';

const gameData = useGameDataStore();

const style = computed(() => ({
    width: `${gameData.grid.cols * gameData.grid.tileSize}px`,
    height: `${gameData.grid.rows * gameData.grid.tileSize}px`
}));

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
        gameData.moveToken(tokenId, tileIndex);
    }
    activeToken.value = "";
    hoveredTile.value = -1;
});

</script>

<template>
    <div class="flex flex-wrap bg-slate-400 select-none" :style="style">
        <GridTile v-for="_, i in gameData.tiles" :tileIndex="i" />
    </div>
</template>