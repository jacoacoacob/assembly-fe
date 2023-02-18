import { defineStore } from "pinia";
import { ref } from "vue";

import { load, save } from "@/storage";

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
}

const useSettingsStore = defineStore("settings", {
    state: (): Settings => ({
        showHelpMessage: false,
        seasonalTileCapacityModifiers: {
            warm: 2,
            mild: 0,
            cold: -2,
        },
        degradationRate: 1,
        recoveryRate: 1,
    }),
    actions: {
        load() {
            const data = load<Settings>("", SETTINGS_NAMESPACE);
            if (data) {
                this.$patch(data);
            }
        },
        save() {
            save<Settings>("", this.$state, SETTINGS_NAMESPACE);
        },
    }
});

export { useSettingsStore };
