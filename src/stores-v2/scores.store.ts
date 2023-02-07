import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { useGameDataStore } from "./game-data.store";
import type { PlayerPoints } from "./scores.types";
import { useScoring } from "../composables/use-scoring";
import { usePlayerMovesStore } from "./player-moves.store";
import { sum } from "@/utils/sum";
import { useMoveTokenStore } from "./move-token.store";

const useScoresStore = defineStore("scores", () => {
    const scoring = useScoring();
    const playerMoves = usePlayerMovesStore();

    const points = ref<PlayerPoints>({});

    const liveTileScores = computed(() => scoring.scoreTiles());

    const committedMovesPoints = computed((): number =>
        sum(playerMoves.committedMovesDetails.map((move) => move.cost))
    );

    return { points, liveTileScores, committedMovesPoints };
});

export { useScoresStore };
