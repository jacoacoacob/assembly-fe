import { useRoute } from "vue-router";

import type { GameSocket } from "@/socket";
import { useSessionStore, type ClientSession } from "../stores/session-store";

function registerSessionHandlers(socket: GameSocket) {
    const route = useRoute();
    const session = useSessionStore();

    socket.on("session:client_id", (clientId) => {
        localStorage[`glid_${route.params.gameLinkId}`] = clientId;
        session.clientId = clientId;
    });

    socket.on("session:all", (sessions) => {
        session.allSessions = sessions;
    });

}

export { registerSessionHandlers };
