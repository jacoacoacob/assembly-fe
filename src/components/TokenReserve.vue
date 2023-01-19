<script setup lang="ts">
import { computed } from 'vue';

import GameToken from './GameToken.vue';
import { useGameDataStore } from '@/stores/game-data-store';
import { useGameStateStore } from '@/stores/game-state-store';
import { useBoardSetupStore } from '@/stores/board-setup-store';
import { useTokenReserve } from '@/composables/use-token-reserve';

const gameData = useGameDataStore();
const gameState = useGameStateStore();
const setupBoard = useBoardSetupStore();

const data = useTokenReserve();

const props = defineProps<{
    playerId: string;
}>();

const tokens = computed(() => data.tokens.value[props.playerId]);

function onDragEnter(event: DragEvent) {
    event.preventDefault();
}

function onDragOver(event: DragEvent) {
    event.preventDefault();
}

function onDrop(event: DragEvent) {
    event.preventDefault();
    const tokenId = event.dataTransfer?.getData("text");
    if (tokenId) {
        gameState.pushEvent("setup_board:move_token", {
            tokenId,
            tileIndex: -1,
        });
    }
}

</script>

<template>
    <div class="flex flex-col bg-slate-300" @drop="onDrop" @dragenter="onDragEnter" @dragover="onDragOver">
        <div v-for="segment, i in tokens" :key="i" class="flex">
            <GameToken v-for="token in segment" :key="token.id" :data="token" class="mr-1 mb-1" />
        </div>
    </div>
</template>