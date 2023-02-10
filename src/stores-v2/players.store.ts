import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useGameDataStore } from "./game-data.store";
import type { Player } from "./game-data.types";

const PLAYER_COLOR_OPTIONS = {
    green: "bg-green-500",
    violet: "bg-violet-500",
    orange: "bg-orange-400",
    blue: "bg-blue-400",
    red: "bg-red-400",
};

const usePlayersStore = defineStore("players", () => {
    const gameData = useGameDataStore();

    const _playerOrder = ref<Player["id"][]>([]);

    function setPlayerOrder(playerIds: Player["id"][]) {
        _playerOrder.value = playerIds;
    }

    const playerList = computed(() => _playerOrder.value.map(
        (playerId) => gameData.players[playerId]
    ));

    const viewedPlayerIndex = ref(0);
    const viewedPlayer = computed(() => playerList.value[viewedPlayerIndex.value]);

    const activePlayerIndex = ref(0);
    const activePlayer = computed(() => playerList.value[activePlayerIndex.value]);

    function setViewedPlayer(index: number) {
        viewedPlayerIndex.value = index;
    }

    function viewActivePlayer() {
        viewedPlayerIndex.value = activePlayerIndex.value;
    }

    function nextPlayer() {
        activePlayerIndex.value = activePlayerIndex.value + 1 >= playerList.value.length
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
        setPlayerOrder,
        nextPlayer,
        playerList,
    };
});

export { usePlayersStore, PLAYER_COLOR_OPTIONS };
