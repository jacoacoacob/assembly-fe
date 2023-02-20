import { defineStore } from "pinia";
import { ref } from "vue";

import { load, save } from "@/storage";
import { useGameDataStore } from "./game-data.store";

const SETTINGS_NAMESPACE = "settings";

interface Settings {
    showHelpMessage: boolean;
    seasonalTileCapacityModifiers: {
        warm: number;
        mild: number;
        cold: number;
    };
    degradationRate: number;
    recoveryRate: number;
    playerSortMethod: "shuffle" | "static" | "rotate"; 
}

const useSettingsStore = defineStore("settings", {
    state: (): Settings => ({
        showHelpMessage: false,
        seasonalTileCapacityModifiers: {
            warm: 2,
            mild: 0,
            cold: -4,
        },
        degradationRate: 1,
        recoveryRate: 1,
        playerSortMethod: "rotate",
    }),
    actions: {
        load() {
            const gameData = useGameDataStore();
            const data = load<Settings>(gameData.name, SETTINGS_NAMESPACE);
            if (data) {
                this.$patch(data);
            }
        },
        save() {
            const gameData = useGameDataStore();
            save<Settings>(gameData.name, this.$state, SETTINGS_NAMESPACE);
        },
    }
});

export { useSettingsStore };
