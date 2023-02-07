import { defineStore } from "pinia";
import { ref } from "vue";

import type { PlayerPoints } from "./scores.types";
import { useScoring } from "../composables/use-scoring";

const useScoresStore = defineStore("scores", () => {
    const { tileScores, committedMovesCost, currentMoveCost, currentMoveTilePoints } = useScoring();

    const pointTotals = ref<PlayerPoints>({});

    return { pointTotals, tileScores, committedMovesCost, currentMoveCost, currentMoveTilePoints };
});

export { useScoresStore };
