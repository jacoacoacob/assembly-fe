<script setup lang="ts">
import { computed } from 'vue';

import GameToken from './GameToken.vue';
import { useGameStateStore } from '@/stores/game-state-store';
import { usePlayersDataStore } from '@/stores/players-data-store';
import { useGameDataStore } from '@/stores/game-data-store';
import { useTokensDataStore } from '@/stores/tokens-data-store';

const gameState = useGameStateStore();
const gameData = useGameDataStore();
const playersData = usePlayersDataStore();

const tokensData = useTokensDataStore();

const props = defineProps<{
    playerId: string;
}>();

const tokens = computed(() => tokensData.reserveTokens[props.playerId]);

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
                :class="{ 'opacity-60': token.player !== playersData.activePlayer.id }"
                :isUnavailable="tokensData.unplaceableTokenIds.includes(token.id)"
            />
        </div>
    </div>
</template>