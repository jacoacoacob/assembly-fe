<script setup lang="ts">
import { computed } from 'vue';

import GameToken from './GameToken.vue';
import { useGameStateStore, type StateName } from '@/stores/game-state-store';
import { useTokenReserve } from '@/composables/use-token-reserve';
import { usePlayerDataStore } from '@/stores/player-data-store';

const gameState = useGameStateStore();
const playerData = usePlayerDataStore();

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
        if (gameState.currentState === "place_tokens") {
            gameState.pushEvent("place_tokens:move_token", { tokenId, tileIndex: -1 });
        }
        if (gameState.currentState === "play_game") {
            // gameState.pushEvent("")
        }
    }
}

</script>

<template>
    <div class="flex flex-col select-none" @drop="onDrop" @dragenter="onDragEnter" @dragover="onDragOver">
        <div v-for="segment, i in tokens" :key="i" class="flex">
            <GameToken
                v-for="token in segment"
                :key="token.id"
                :token="token"
                class="mr-1 mb-1"
                :class="{ 'opacity-60': token.player !== playerData.activePlayer.id }"
                :isUnavailable="data.unplaceableTokenIds.value.includes(token.id)"
            />
        </div>
    </div>
</template>