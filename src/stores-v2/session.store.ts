import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { User } from "@supabase/supabase-js";

const useSessionStore = defineStore("session", () => {
    const user = ref<User | null>(null);

    const isLoggedIn = computed(() => Boolean(user.value))

    return { user, isLoggedIn };
});

export { useSessionStore };
