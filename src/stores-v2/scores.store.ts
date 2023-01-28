import { sum } from "@/utils/sum";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

import { useGameDataStore } from "./game-data.store";
import type { Player } from "./game-data.types";
import { usePlayersStore } from "./players.store";
import type { PlayerPoints } from "./scores.types";
import { useTilesStore } from "./tiles.store";
import { useTokensStore } from "./tokens.store";

const useScoresStore = defineStore("scores", () => {
    const gameData = useGameDataStore();
    const tiles = useTilesStore();
    const tokens = useTokensStore();
    const players = usePlayersStore();

    const points = ref<PlayerPoints>({});

    function initPoints() {
        points.value = Object.fromEntries(
            gameData.players.map((player) => [player.id, 0])
        );
    } 

    // const reservePoints = computed((): PlayerPoints =>
    //     Object.entries(tokens.reservePlayerTokenIds).reduce(
    //         (accum: PlayerPoints, [playerId, tokenIds]) => {
    //             accum[playerId] = sum(tokenIds.map((tokenId) => gameData.tokens[tokenId].value));
    //             return accum;
    //         },
    //         {}
    //     )
    // );

    return { points, initPoints };
});

export { useScoresStore };
