import { ref } from "vue";
import { defineStore } from "pinia";

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
     * A role endows a client with a set of permissions.
     */
    role: string;
    /** 
     * Each connected client may represent 1 or more players in a game.
     */
    playerIds: string[];
}
    

const useSessionStore = defineStore("session", () => {

    const data = ref<ClientSession | null>(null);

    return { data };
});

export { useSessionStore };
export type { ClientSession };
