<script setup lang="ts">
import { computed } from 'vue';

import GameToken from './GameToken.vue';
import { useGameStateStore, type StateName } from '@/stores/game-state-store';
import { useTokenReserve } from '@/composables/use-token-reserve';
import { usePlayerDataStore } from '@/stores/player-data-store';
import { useGameDataStore } from '@/stores/game-data-store';

const gameState = useGameStateStore();
const gameData = useGameDataStore();
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
    const token = gameData.tokens[tokenId ?? ""];
    if (token) {
        if (gameState.currentState === "place_tokens") {
            if (token.tileIndex > -1) {
                gameState.pushEvent("place_tokens:move_token", { tokenId, tileIndex: -1 });
            } else {
                gameState.pushEvent("place_tokens:set_candidate_token", { tokenId: "" });
            }
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