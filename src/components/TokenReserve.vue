<script setup lang="ts">
import { computed } from 'vue';

import GameToken from './GameToken.vue';
import { useGameStateStore } from '@/stores/game-state-store';
import { useTokenReserve } from '@/composables/use-token-reserve';

const gameState = useGameStateStore();

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
    <div class="flex flex-col select-none" @drop="onDrop" @dragenter="onDragEnter" @dragover="onDragOver">
        <div v-for="segment, i in tokens" :key="i" class="flex">
            <GameToken
                v-for="token in segment"
                :key="token.id"
                :data="token"
                class="mr-1 mb-1"
                :isUnavailable="data.unplaceableTokenIds.value.includes(token.id)"
            />
        </div>
    </div>
</template>