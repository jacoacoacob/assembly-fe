<script setup lang="ts">
import { onMounted } from 'vue';

import TheBoard from '@/components/TheBoard.vue';
import TheSidePanel from '@/components/TheSidePanel.vue';
import TopBar from '@/components/TopBar.vue';

import { usePlaceTokensState } from '@/stores-v2/states/use-place-tokens-state';
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { usePlayersStore } from '@/stores-v2/players.store';
import { usePlayState } from '@/stores-v2/states/use-play-state';

const placeTokensState = usePlaceTokensState();
const playState = usePlayState();
const gameState = useGameStateStore();
const players = usePlayersStore();

function onWindowKeydown(event: KeyboardEvent) {
    const { currentState } = gameState;
    if (event.code === "Space") {
        switch (currentState) {
            case "place_tokens": return placeTokensState.endTurn();
            case "play": return playState.endTurn();
        }
    }
    if (event.code === "Enter") {
        switch (currentState) {
            case "play": return playState.commitMove();
        }
    }
}

onMounted(() => {
    players.viewActivePlayer();
    window.addEventListener("keydown", onWindowKeydown);
    return () => {
        window.removeEventListener("keydown", onWindowKeydown);
    }
});

</script>

<template>
    <div class="px-8 w-full space-x-6 flex">
        <div class="space-y-6 ">
            <TopBar />
            <TheBoard />
        </div>
        <TheSidePanel class="flex-1 w-full" />
    </div>
</template>