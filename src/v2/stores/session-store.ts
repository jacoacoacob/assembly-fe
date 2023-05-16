import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useRoute } from "vue-router";
import { lRef } from "../composables/use-listen-emit-ref";

interface ClientSession {
    /**
     * The unique identifier used to associate various database objects
     * related to a given game.
     */
    gameId: string;
    /**
     * The unique identifier for a client (a specific browser instance on a 
     * specific device).
     */
    clientId: string;
    /**
     * A human readable name for use in UI
     */
    clientDisplayName: string;
    /**
     * A role endows a client with a set of permissions.
     */
    role: "owner" | "guest";
    /** 
     * Each connected client may represent 1 or more players in a game.
     */
    playerIds: string[];
}
    

const useSessionStore = defineStore("session", () => {
    /** All clients actively connected to this game */
    const allSessions = lRef("session:all", []);
    
    /** The clientId assigned to the user's browser */
    const clientId = lRef("session:client_id", "");

    

    // const clientId = ref<ClientSession["clientId"] | null>(null);

    /** Session data belonging to the user's browser */
    const clientSession = computed(
        () => allSessions.value.find((session) => session.clientId === clientId.value)
    );

    return { clientId, clientSession, allSessions };
});

export { useSessionStore };
export type { ClientSession };
