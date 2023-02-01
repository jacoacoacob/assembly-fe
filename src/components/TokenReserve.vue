<script setup lang="ts">
import { computed } from 'vue';
// import { useMove } from '@/stores-v2/composables/use-move';
import { useGameDataStore } from '@/stores-v2/game-data.store';
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { usePlayersStore } from '@/stores-v2/players.store';
import { usePlaceTokensState } from '@/stores-v2/states/use-place-tokens-state';
import { useTokensStore } from '@/stores-v2/tokens.store';
import { useMoveTokenStore } from '@/stores-v2/move.store';

import GameToken from './GameToken.vue';

const gameState = useGameStateStore();
const gameData = useGameDataStore();
const players = usePlayersStore();
const tokensStore = useTokensStore();
const placeTokensState = usePlaceTokensState();

const moveToken = useMoveTokenStore();

const props = defineProps<{
    playerId: string;
}>();

const tokenIdSegments = computed(
    () => tokensStore.reservePlayerTokenIdsByTokenValue[props.playerId]
);

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
        moveToken.drop(-1);
        // if (gameState.currentState === "place_tokens") {
            // placeTokensState.endMove(token.id, -1);
        // }
    }
}

</script>

<template>
    <div v-if="tokenIdSegments" class="flex flex-col select-none" @drop="onDrop" @dragenter="onDragEnter" @dragover="onDragOver">
        <div v-for="segment, i in tokenIdSegments" :key="i" class="flex">
            <GameToken
                v-for="tokenId in segment"
                :key="tokenId"
                :tokenId="tokenId"
                class="mr-1 mb-1"
                :class="{ 'opacity-60': gameData.tokens[tokenId].playerId !== players.activePlayer.id }"
            />
        </div>
    </div>
</template>