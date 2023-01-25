import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useGameDataStore } from "@/stores/game-data-store";

const usePlayersDataStore = defineStore("player-data", () => {
    const gameData = useGameDataStore();

    const viewedPlayerIndex = ref(0);
    const viewedPlayer = computed(() => gameData.players[viewedPlayerIndex.value]);

    const activePlayerIndex = ref(0);
    const activePlayer = computed(() => gameData.players[activePlayerIndex.value]);

    function setViewedPlayer(index: number) {
        viewedPlayerIndex.value = index;
    }

    function viewActivePlayer() {
        setViewedPlayer(activePlayerIndex.value);
    }

    function nextPlayer() {
        activePlayerIndex.value = activePlayerIndex.value + 1 >= gameData.players.length
            ? 0
            : activePlayerIndex.value + 1;
    }

    return {
        activePlayer,
        activePlayerIndex,
        viewedPlayer,
        setViewedPlayer,
        viewActivePlayer,
        nextPlayer,
    };
});

export { usePlayersDataStore };
