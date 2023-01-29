import { defineStore } from "pinia";
import { ref } from "vue";

import { useGameDataStore } from "./game-data.store";
import type { PlayerPoints } from "./scores.types";

const useScoresStore = defineStore("scores", () => {
    const gameData = useGameDataStore();

    const points = ref<PlayerPoints>({});

    function initPoints() {
        points.value = Object.fromEntries(
            gameData.players.map((player) => [player.id, 0])
        );
    } 

    return { points, initPoints };
});

export { useScoresStore };
