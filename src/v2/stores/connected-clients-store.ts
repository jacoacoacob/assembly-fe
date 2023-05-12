import { ref } from "vue";
import { defineStore } from "pinia";

import type { ClientSession } from "./session-store";

const useConnectedClientsStore = defineStore("connected-clients", () => {

    const data = ref<ClientSession[]>([]);

    return { data };
});

export { useConnectedClientsStore };
