import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { useGameDataStore } from "./game-data.store";
import type { PlayerPoints } from "./scores.types";
import { useScoring } from "./use-scoring";

const useScoresStore = defineStore("scores", () => {
    const gameData = useGameDataStore();
    const scoring = useScoring();

    const points = ref<PlayerPoints>({});

    const liveScore = computed(() => scoring.calculatePoints())

    function initPoints() {
        points.value = Object.fromEntries(
            gameData.players.map((player) => [player.id, 0])
        );
    }

    return { points, initPoints, liveScore };
});

export { useScoresStore };
