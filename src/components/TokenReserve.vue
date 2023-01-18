<script setup lang="ts">
import { computed, inject } from 'vue';

import GameToken from './GameToken.vue';
import { useGameDataStore } from '@/stores/data-store';
import { useGameStateStore } from '@/stores/state-store';

const gameData = useGameDataStore();
const gameState = useGameStateStore();

const props = defineProps<{
    playerId: string;
}>();

const tokens = computed(() => gameData.tokenReserves[props.playerId].map(
    (tokenId) => gameData.tokens[tokenId]
));

// const onDrop = inject<(event: DragEvent) => void>("reserve:drop");
// const onDragOver = inject<(event: DragEvent) => void>("reserve:dragover");
// const onDragEnter = inject<(event: DragEvent) => void>("reserve:dragenter");

function onDragEnter(event: DragEvent) {
    event.preventDefault();
}

function onDragOver(event: DragEvent) {
    event.preventDefault();
}

function onDrop(event: DragEvent) {
    event.preventDefault();
    // const target = event.target as HTMLDivElement;
    const tokenId = event.dataTransfer?.getData("text");
    if (tokenId) {
        gameState.pushEvent({
            type: "move_token",
            data: {
                tokenId,
                tileIndex: -1
            }
        })
    }
}

</script>

<template>
    <div class="flex flex-wrap" @drop="onDrop" @dragenter="onDragEnter" @dragover="onDragOver">
        <GameToken v-for="token in tokens" :key="token.id" :data="token" class="mr-1 mb-1" />
    </div>
</template>