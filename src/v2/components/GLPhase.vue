<script setup lang="ts">
import { useGameStore } from "../stores/game-store";
import { useSessionStore } from "../stores/session-store";
import { useEmitWithAck } from "../composables/use-emitters";
import { computed } from "vue";

const game = useGameStore();
const session = useSessionStore();

const guestMessage = computed(() => {
    switch (game.meta.phase) {
        case "setup": return "The game has not started yet.";
        case "play": return "The game is in progress.";
        case "complete": return "The game has ended."
    }
});

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
        <template v-if="session.isOwner && game.meta.phase === 'setup'">
            <div class="space-y-2">
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
        </template>
        <template v-else>
            {{ guestMessage }}
        </template>
    </div>
</template>