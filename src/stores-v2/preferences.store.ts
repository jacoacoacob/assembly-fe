import { load, save } from "@/storage";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

const STORAGE_NAMESPACE = "prefs-assemblage";

interface Preferences {
    showHelpMessage: boolean;
}

const usePreferencesStore = defineStore("preferences", () => {
    
    const showHelpMessage = ref(false);

    function loadLocal() {
        const data = load<Preferences>(STORAGE_NAMESPACE);
        if (data) {
            showHelpMessage.value = data.showHelpMessage;
        }
    }

    function saveLocal() {
        save(STORAGE_NAMESPACE, {
            showHelpMessage: showHelpMessage.value,
        });
    }

    return {
        showHelpMessage,
        loadLocal,
        saveLocal,
    };
});

export { usePreferencesStore };
