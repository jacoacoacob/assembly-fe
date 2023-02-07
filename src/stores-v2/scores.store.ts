import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { useGameDataStore } from "./game-data.store";
import type { PlayerPoints } from "./scores.types";
import { useScoring } from "../composables/use-scoring";

const useScoresStore = defineStore("scores", () => {
    const scoring = useScoring();

    const points = ref<PlayerPoints>({});

    const liveScore = computed(() => scoring.scoreTiles())

    return { points, liveScore };
});

export { useScoresStore };
