<script setup lang="ts">
import { useGameStore } from "../stores/game-store";
import { useSessionStore } from "../stores/session-store";
import { useEmitWithAck } from "../composables/use-emitters";

const game = useGameStore();
const session = useSessionStore();

async function onStartGame() {
    const { emit } = useEmitWithAck("game_meta:start_game");
    try {
        await emit();
    } catch (error) {
        console.warn((error as Error).message);
    }
}

</script>

<template>
    <div class="border border-slate-300 rounded p-4 bg-slate-100">
        <template v-if="session.isOwner">
            <div v-if="game.meta.phase === 'setup'" class="space-y-2">
                <button
                    class="p-2 shadow bg-slate-900 text-white rounded"
                    @click="onStartGame"
                >
                    Start game
                </button>
                <p>
                    Once started, no more players may be added.
                    Players may still be claimed and unclaimed.
                </p>
                <p class="font-semibold">
                    This action cannot be reversed.
                </p>
            </div>
            <template v-else-if="game.meta.phase === 'play'">
                The game is in progress.
            </template>
            <template v-else>
                The game has ended.
            </template>
        </template>
        <template v-else>
            
        </template>
    </div>
</template>