<script setup lang="ts">
import { computed } from 'vue';

import GameToken from './GameToken.vue';
import TokenReserveSetupBoard from './TokenReserveSetupBoard.vue';
import { useGameDataStore } from '@/stores/game-data-store';
import { useGameStateStore } from '@/stores/game-state-store';
import { useSetupBoardStore } from '@/stores/setup-board-store';

const gameData = useGameDataStore();
const gameState = useGameStateStore();
const setupBoard = useSetupBoardStore();

const props = defineProps<{
    playerId: string;
}>();

// const tokens = computed(() => gameData.tokenReserves[props.playerId].map(
//     (tokenId) => gameData.tokens[tokenId]
// ));

const tokens = computed(() =>
    gameData.tokenReserves[props.playerId].map((tokenId) => gameData.tokens[tokenId])
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
    <div class="flex flex-wrap h-20 bg-slate-300" @drop="onDrop" @dragenter="onDragEnter" @dragover="onDragOver">
        <TokenReserveSetupBoard v-if="gameState.currentState === 'setup_board'" :player-id="playerId" />
        <template v-else>
            <GameToken v-for="token in tokens" :key="token.id" :data="token" class="mr-1 mb-1" />
        </template>
    </div>
</template>