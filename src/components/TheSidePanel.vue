<script setup lang="ts">
import TokenReserve from './TokenReserve.vue';
import { useGameDataStore } from '@/stores-v2/game-data.store';
import { usePlayersStore, PLAYER_COLOR_OPTIONS } from '@/stores-v2/players.store';
import { useScoresStore } from '@/stores-v2/scores.store';
import { useGameStateStore } from '@/stores-v2/game-state.store';
import PlayerMoves from './PlayerMoves.vue';

const gameState = useGameStateStore();
const gameData = useGameDataStore();
const players = usePlayersStore();
const scores = useScoresStore();
</script>

<template>
    <div class="bg-slate-100 border-2 border-slate-500 p-4 space-y-6 flex flex-col" v-if="players.viewedPlayer">
        <ul class=" space-y-2">
            <li v-for="player, i in gameData.players" :key="player.id">
                <button
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
                        <span class="text-slate-500">{{ scores.tileScores[player.id] ?? 0 }} +</span> {{ scores.pointTotals[player.id] }}
                    </div>
                </button>
            </li>
        </ul>
        <div class="space-y-2">
            <h3 class="text-lg"><span class="font-semibold">{{ players.viewedPlayer.name }}</span>'s tokens</h3>
            <div v-if="players.viewedPlayer">
                <TokenReserve :playerId="players.viewedPlayer.id" />
            </div>
        </div>
        <PlayerMoves v-if="gameState.currentState === 'play'"  />
    </div>
</template>