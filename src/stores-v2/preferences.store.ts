import { load, save } from "@/storage";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

const PREFERENCES_NAMESPACE = "preferences";

interface Preferences {
    showHelpMessage: boolean;
}

const usePreferencesStore = defineStore("preferences", () => {
    
    const showHelpMessage = ref(false);

    function loadLocal() {
        const data = load<Preferences>("", PREFERENCES_NAMESPACE);
        if (data) {
            showHelpMessage.value = data.showHelpMessage;
        }
    }

    function saveLocal() {
        save("", {
            showHelpMessage: showHelpMessage.value,
        }, PREFERENCES_NAMESPACE);
    }

    return {
        showHelpMessage,
        loadLocal,
        saveLocal,
    };
});

export { usePreferencesStore };
