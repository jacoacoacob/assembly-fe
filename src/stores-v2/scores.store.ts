import { defineStore } from "pinia";
import { ref } from "vue";

import type { PlayerPoints } from "./scores.types";
import { useScoring } from "../composables/use-scoring";

const useScoresStore = defineStore("scores", () => {
    const { tileScores, committedMovePoints } = useScoring();

    const pointTotals = ref<PlayerPoints>({});

    return { pointTotals, tileScores, committedMovePoints  };
});

export { useScoresStore };
