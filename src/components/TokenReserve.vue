<script setup lang="ts">
import { useEventsStore } from '@/stores-v2/events.store';
import { useGameDataStore } from '@/stores-v2/game-data.store';
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { usePlayersStore } from '@/stores-v2/players.store';
import { usePlaceTokensState } from '@/stores-v2/states/use-place-tokens-state';
import { useTokensStore } from '@/stores-v2/tokens.store';
import { computed } from 'vue';

import GameToken from './GameToken.vue';
// import { useGameStateStore } from '@/stores/game-state-store';
// import { usePlayersDataStore } from '@/stores/players-data-store';
// import { useGameDataStore } from '@/stores/game-data-store';
// import { useTokensDataStore } from '@/stores/tokens-data-store';

// const gameState = useGameStateStore();
// const gameData = useGameDataStore();
// const playersData = usePlayersDataStore();

// const tokensData = useTokensDataStore();

const gameState = useGameStateStore();
const gameData = useGameDataStore();
// const events = useEventsStore();
const players = usePlayersStore();
const tokensStore = useTokensStore();
const placeTokens = usePlaceTokensState();

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
        if (gameState.currentState === "place_tokens") {
            placeTokens.endMove(token.id, -1);
            // if (token.tileIndex > -1) {
            //     gameState.pushEvent("place_tokens:move_token", { tokenId, tileIndex: -1 });
            // } else {
            //     gameState.pushEvent("place_tokens:set_candidate_token", { tokenId: "" });
            // }
        }
        // if (gameState.currentState === "play_game") {
            // gameState.pushEvent("")
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