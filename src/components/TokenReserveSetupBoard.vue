<script setup lang="ts">
import { computed } from 'vue';

import GameToken from './GameToken.vue';
import { useSetupBoardStore } from '@/stores/setup-board-store';
import { useGameDataStore } from '@/stores/game-data-store';

const setupBoard = useSetupBoardStore();
const gameData = useGameDataStore();

const props = defineProps<{
    playerId: string;
}>();

const tokens = computed(() =>
    setupBoard.stagedTokens[props.playerId]
        .filter(tokenId => setupBoard.remainingTokens.includes(tokenId))
        .map((tokenId) => gameData.tokens[tokenId])
);
</script>

<template>
    <GameToken v-for="token in tokens" :key="token.id" :data="token" class="mr-1 mb-1" />
</template>