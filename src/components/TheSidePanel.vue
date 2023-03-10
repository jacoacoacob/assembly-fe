<script setup lang="ts">
import { inject, type Ref } from 'vue';

import TokenReserve from './TokenReserve.vue';
import PlayerMoves from './PlayerMoves.vue';

import { usePlayersStore, PLAYER_COLOR_OPTIONS } from '@/stores-v2/players.store';
import { useScoresStore } from '@/stores-v2/scores.store';
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { useRoundsStore } from '@/stores-v2/rounds.store';

const gameState = useGameStateStore();
const players = usePlayersStore();
const scores = useScoresStore();
const rounds = useRoundsStore();

const boardView = inject<Ref<"game" | "rules">>("boardView");
</script>

<template>
    <div class="bg-slate-100 border-2 border-slate-500 p-4 relative max-w-[300px]" v-if="players.viewedPlayer">
        <div v-if="boardView === 'rules'" class="absolute top-0 left-0 bg-slate-100 opacity-50 h-full w-full z-40"></div>
        <div class="space-y-5 flex flex-col h-full" :aria-hidden="boardView !== 'game'">
            <div class="font-semibold text-end">
                Round {{ rounds.currentRound }}
            </div>
            <TransitionGroup tag="ul" name="reorder" class="space-y-2">
                <li v-for="player, i in players.playerList" :key="player.id">
                    <button
                        :tabindex="boardView !== 'game' ? -1 : undefined"
                        class="button button-dense button-outline bg-transparent flex justify-between w-full"
                        :class="{
                            'bg-white': i === players.viewedPlayerIndex,
                            'ring ring-slate-800': i === players.activePlayerIndex
                        }"
                        @click="() => players.setViewedPlayer(i)"
                    >
                        <div class="flex items-center space-x-1">
                            <span class="w-4 h-4 rounded-full" :class="PLAYER_COLOR_OPTIONS[player.color]"></span>
                            <span>
                                {{ player.name }}
                            </span>
                        </div>
                        <div>
                            <span class="text-slate-500">{{ scores.tileScoresTotals[player.id] ?? 0 }} +</span> {{ scores.pointTotals[player.id] }}
                        </div>
                    </button>
                </li>
            </TransitionGroup>
            <div class="space-y-2">
                <TokenReserve v-if="players.viewedPlayer" :playerId="players.viewedPlayer.id" />
            </div>
            <PlayerMoves v-if="gameState.currentState === 'play'"  />
        </div>
    </div>
</template>

<style scoped>
/* 1. declare transition */
.reorder-move,
.reorder-enter-active,
.reorder-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.reorder-enter-from,
.reorder-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.reorder-leave-active {
  position: absolute;
}
</style>