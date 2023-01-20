import { computed, onMounted, ref } from "vue";
import { defineStore } from "pinia";
import { useGameDataStore } from "@/stores/game-data-store";
import { useGameStateStore } from "./game-state-store";
import { useBoardSetupStore } from "./board-setup-store";

const usePlayerStore = defineStore("players", () => {
    const gameData = useGameDataStore();
    const gameState = useGameStateStore();
    const boardSetup = useBoardSetupStore();

    const viewedPlayerIndex = ref(0);

    onMounted(() => {
        viewedPlayerIndex.value = 0
    });

    const activePlayerIndex = computed(() => {
        if (gameState.currentState === "setup_board") {
            return boardSetup.activePlayerIndex;
        }
        if (gameState.currentState === "play_game") {
            return 0;
        }
        return 0;
    })

    const activePlayer = computed(() => gameData.players[activePlayerIndex.value]);

    const viewedPlayer = computed(() => gameData.players[viewedPlayerIndex.value]);

    function setViewedPlayer(index: number) {
        viewedPlayerIndex.value = index;
    }

    return {
        activePlayer,
        activePlayerIndex,
        viewedPlayer,
        setViewedPlayer,
        players: computed(() => gameData.players),
    };
});

export { usePlayerStore };
