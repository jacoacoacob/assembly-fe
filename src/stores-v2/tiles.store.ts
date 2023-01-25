import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { useGameDataStore } from "./game-data.store";

const useTilesStore = defineStore("tiles", () => {
    const gameData = useGameDataStore();

    const inPlayTiles = ref<number[]>([]);

    return { inPlayTiles };
});

export { useTilesStore };
