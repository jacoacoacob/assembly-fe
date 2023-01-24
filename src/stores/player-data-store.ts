import { computed, onMounted, ref } from "vue";
import { defineStore } from "pinia";
import { useGameDataStore } from "@/stores/game-data-store";
import { useGameStateStore } from "./game-state-store";
import { usePlaceTokensStore } from "./place-tokens-store";

const usePlayerDataStore = defineStore("player-data", () => {
    const gameData = useGameDataStore();
    const gameState = useGameStateStore();
    const placeTokensStore = usePlaceTokensStore();

    const viewedPlayerIndex = ref(0);

    const viewedPlayer = computed(() => gameData.players[viewedPlayerIndex.value]);

    function setViewedPlayer(index: number) {
        viewedPlayerIndex.value = index;
    }

    const activePlayerIndex = computed(() => {
        if (gameState.currentState === "place_tokens") {
            return placeTokensStore.activePlayerIndex;
        }
        if (gameState.currentState === "play_game") {
            return 0;
        }
        return 0;
    })

    const activePlayer = computed(() => gameData.players[activePlayerIndex.value]);

    // onMounted(() => {
    //     setViewedPlayer(activePlayerIndex.value);
    // });

    return {
        activePlayer,
        activePlayerIndex,
        viewedPlayer,
        setViewedPlayer,
        players: computed(() => gameData.players),
    };
});

export { usePlayerDataStore };
