<script setup lang="ts">
import { computed } from 'vue';

import GameToken from './GameToken.vue';
import { useGameDataStore } from '@/stores-v2/game-data.store';
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { usePlayersStore } from '@/stores-v2/players.store';
import { useTokensStore } from '@/stores-v2/tokens.store';
import { useDrag } from '@/composables/use-drag';
import { useMoveTokenStore } from '@/stores-v2/move-token.store';


const drag = useDrag();

const gameState = useGameStateStore();
const gameData = useGameDataStore();
const players = usePlayersStore();
const tokensStore = useTokensStore();
const moveToken = useMoveTokenStore();

const props = defineProps<{
    playerId: string;
}>();

const tokenIdSegments = computed(
    () => tokensStore.reservePlayerTokenIdsByTokenValue[props.playerId]
);

const className = computed(() => {
    const isHovered = moveToken.hoveredTileIndex === -1;
    const isOrigin =  moveToken.candidateOriginTileIndex === -1;
    return {
        "bg-white ring-2 ring-cyan-500": isOrigin,
        "bg-white": isHovered,
        "bg-slate-200": !isOrigin && !isHovered,
    };
})

</script>

<template>
    <div
        class="flex flex-col select-none p-1 rounded min-h-[30px]"
        :class="className"
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
                :class="{
                    'opacity-60': gameData.tokens[tokenId].playerId !== players.activePlayer.id,
                }"
            />
        </div>
    </div>
</template>