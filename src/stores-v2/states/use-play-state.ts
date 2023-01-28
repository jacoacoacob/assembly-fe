import { defineStore } from "pinia";
import { computed } from "vue";
import { useEventsStore } from "../events.store";
import { useGameDataStore } from "../game-data.store";
import { useTilesStore } from "../tiles.store";
import { useTokensStore } from "../tokens.store";

const usePlayState = defineStore("play-state", () => {
    const gameData = useGameDataStore();
    const events = useEventsStore();
    const tokens = useTokensStore();
    const tiles = useTilesStore();

    return {  };
});

export { usePlayState };
