import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useGameDataStore } from "./game-data.store";

const PLAYER_COLOR_OPTIONS = {
    green: "bg-green-500",
    violet: "bg-violet-500",
    orange: "bg-orange-400",
    blue: "bg-blue-400",
    red: "bg-red-400",
};

const usePlayersStore = defineStore("players", () => {
    const gameData = useGameDataStore();

    const viewedPlayerIndex = ref(0);
    const viewedPlayer = computed(() => gameData.players[viewedPlayerIndex.value]);

    const activePlayerIndex = ref(0);
    const activePlayer = computed(() => gameData.players[activePlayerIndex.value]);

    function setViewedPlayer(index: number) {
        viewedPlayerIndex.value = index;
    }

    function viewActivePlayer() {
        viewedPlayerIndex.value = activePlayerIndex.value;
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
        viewedPlayerIndex,
        viewActivePlayer,
        setViewedPlayer,
        nextPlayer,
    };
});

export { usePlayersStore, PLAYER_COLOR_OPTIONS };
