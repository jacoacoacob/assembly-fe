<script setup lang="ts">
import { computed } from 'vue';

import GameToken from './GameToken.vue';
import { useGameDataStore } from '@/stores-v2/game-data.store';
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { usePlayersStore } from '@/stores-v2/players.store';
import { useTokensStore } from '@/stores-v2/tokens.store';
import { useDrag } from '@/composables/use-drag';


const drag = useDrag();

const gameState = useGameStateStore();
const gameData = useGameDataStore();
const players = usePlayersStore();
const tokensStore = useTokensStore();

const props = defineProps<{
    playerId: string;
}>();

const tokenIdSegments = computed(
    () => tokensStore.reservePlayerTokenIdsByTokenValue[props.playerId]
);

</script>

<template>
    <div
        v-if="tokenIdSegments"
        class="flex flex-col select-none"
        @drop="drag.onReserveDrop"
        @dragenter="drag.onReserveDragEnter"
        @dragover="drag.onReserveDragOver"
    >
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