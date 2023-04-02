import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface Data {
    username: string;
}

const useSessionStore = defineStore("session", () => {
    const data = ref<Data | null>(null);

    const isLoggedIn = computed(() => Boolean(data.value));

    return { data, isLoggedIn };
});

export { useSessionStore };
