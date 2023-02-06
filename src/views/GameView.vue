<script setup lang="ts">
import { provide, onMounted } from 'vue';
import { useRoute, onBeforeRouteLeave } from 'vue-router';

import TheBoard from '@/components/TheBoard.vue';
import TheSidePanel from '@/components/TheSidePanel.vue';
import TopBar from '@/components/TopBar.vue';

import { usePlaceTokensState } from '@/stores-v2/states/use-place-tokens-state';
import { useTokensStore } from '@/stores-v2/tokens.store';
import { useEventsStore } from '@/stores-v2/events.store';
import { useTilesStore } from '@/stores-v2/tiles.store';
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { usePlayersStore } from '@/stores-v2/players.store';
import { useGameDataStore } from '@/stores-v2/game-data.store';
import { usePlayState } from '@/stores-v2/states/use-play-state';

const gameData = useGameDataStore();
const placeTokensState = usePlaceTokensState();
const playState = usePlayState();
const gameState = useGameStateStore();
const events = useEventsStore();
const tokens = useTokensStore();
const tiles = useTilesStore();
const players = usePlayersStore();

function onWindowKeydown(event: KeyboardEvent) {
    if (event.code === "Space") {
        console.log("onWindowKeydown", gameState.currentState)
        switch (gameState.currentState) {
            case "place_tokens": return placeTokensState.endTurn();
            case "play": return playState.endTurn();
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

        <!-- <TopBar />
        <div class="flex space-x-8">
            <TheBoard />
            <TheSidePanel class="flex-1 w-full" />
        </div> -->
    </div>
</template>