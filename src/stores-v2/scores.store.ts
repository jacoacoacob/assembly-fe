import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { PlayerPoints } from "./scores.types";
import { useScoring } from "../composables/use-scoring";
import { useGameDataStore } from "./game-data.store";
import type { Player } from "./game-data.types";

const useScoresStore = defineStore("scores", () => {
    const gameData = useGameDataStore();
    const { tileScoresTotals, committedMovesCost, currentMoveCost } = useScoring();

    const pointTotals = ref<PlayerPoints>({});
    const roundInitialTileScores = ref<PlayerPoints>({});

    function setRoundInitialTileScores(points: PlayerPoints) {
        roundInitialTileScores.value = points;
    }

    const tileScoresTotalsDelta = computed(() => {
        return gameData.players.reduce(
            (accum: Record<Player["id"], number>, player) => {
                accum[player.id] = tileScoresTotals.value[player.id] - roundInitialTileScores.value[player.id];
                return accum;
            },
            {}
        )
    });

    return { setRoundInitialTileScores, pointTotals, tileScoresTotals, tileScoresTotalsDelta, committedMovesCost, currentMoveCost };
});

export { useScoresStore };
