<script setup lang="ts">
import { provide, nextTick, onMounted } from 'vue';
import TheBoard from '@/components/TheBoard.vue';
import TheSidePanel from '@/components/TheSidePanel.vue';
// import { useGameStateStore } from '@/stores/game-state-store';
// import { useBoard } from '@/composables/use-board';
import TopBar from '@/components/TopBar.vue';
// import { usePlayersDataStore } from '@/stores/players-data-store';
// import { useBoardDataStore } from '@/stores/board-data-store';
// import { useGameDataStore } from "@/stores/game-data-store";
// import { usePlaceTokensStore } from '@/stores/place-tokens-store';
// import { usePlaceTokensActions } from "@/composables/use-place-tokens-actions";
// import { randFromRange, selectRandomFrom } from '@/utils/rand';
import { usePlaceTokensState } from '@/stores-v2/states/use-place-tokens-state';
import { useTokensStore } from '@/stores-v2/tokens.store';
import { useEventsStore } from '@/stores-v2/events.store';
import { useTilesStore } from '@/stores-v2/tiles.store';
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { usePlayersStore } from '@/stores-v2/players.store';


// const placeTokens = usePlaceTokensStore();
// const placeTokensActions = usePlaceTokensActions();
// const gameState = useGameStateStore();
// const playersData = usePlayersDataStore();
// const boardData = useBoardDataStore();

const placeTokens = usePlaceTokensState();
const gameState = useGameStateStore();
const events = useEventsStore();
const tokens = useTokensStore();
const tiles = useTilesStore();
const players = usePlayersStore();


provide("token:dragstart", (event: DragEvent) => {
    const tokenId = (event.target as HTMLDivElement).id;
    if (event.dataTransfer) {
        event.dataTransfer.setData("text", tokenId);
        if (gameState.currentState === "place_tokens") {
            placeTokens.startMove(tokenId);
        }
        // events.send("tokens:set_candidate_id", { tokenId });
    }
});

provide("token:dragend", (event: DragEvent) => {
    // placeTokens.end
    // events.send("tokens:set_candidate_id", { tokenId: "" });
});

function findTileIndex(element: HTMLElement) {
    let current = element;
    while (current.parentElement) {
        if (current.dataset.tileIndex) {
            return Number.parseInt(current.dataset.tileIndex);
        }
        current = current.parentElement;
    }
    return null;
}


provide("tile:dragexit", (event: DragEvent) => {
    event.preventDefault();
    tiles.candidateTileIndex = -1;
});

provide("tile:dragenter", (event: DragEvent) => {
    event.preventDefault();
    const target = (event.target as HTMLDivElement);
    const tileIndex = findTileIndex(target);
    if (tileIndex) {
        tiles.candidateTileIndex = tileIndex;
    }
});

provide("tile:dragover", (event: DragEvent) => {
    event.preventDefault();
});

provide("tile:drop", (event: DragEvent) => {
    event.preventDefault();
    const target = (event.target as HTMLDivElement);
    const tileIndex = findTileIndex(target);
    const tokenId = event.dataTransfer?.getData("text");
    if (typeof tileIndex === "number" && tokenId && tiles.isValidMove(tileIndex, tokenId)) {
        if (gameState.currentState === "place_tokens") {
            placeTokens.endMove(tokenId, tileIndex);
            // events.send("tokens:move_token", { tileIndex, tokenId });
        }
    }
    // boardData.activeToken = "";
    tiles.candidateTileIndex = -1;
});

// function onDrop(event: DragEvent) {
//     event.preventDefault();
//     const target = event.target as HTMLDivElement;
//     const tileIndex = findTileIndex(target);
//     if (typeof tileIndex === "number" && tiles.isValidMove(tileIndex, tokens.candidateTokenId)) {

//     }
// }

function onWindowKeydown(event: KeyboardEvent) {
    if (event.code === "Space") {
        if (gameState.currentState === "place_tokens") {
            if (placeTokens.isTurnEndable) {
                placeTokens.endTurn();
            }
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
    <div class="px-8 w-full space-y-4">
        <TopBar />
        <div class="flex space-x-8">
            <TheBoard />
            <TheSidePanel class="flex-1 w-full" />
        </div>
        <p class="flex-1">
            <!-- Move a token from your reserve to an open tile on the board. -->
        </p>
    </div>
</template>