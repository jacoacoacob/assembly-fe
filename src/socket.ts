import { useRoute } from "vue-router";
import { defineStore } from "pinia";
import { Socket, io } from "socket.io-client";

import type { ClientSession } from "./v2/stores/session-store";
import { useConnectedClientsStore } from "./v2/stores/connected-clients-store";
import { useSessionStore } from "./v2/stores/session-store";

const IO_URL = import.meta.env.VITE_IO_URL;

interface ServerToClientEvents {
    connected_clients: (clients: ClientSession[]) => void;
    session: (data: ClientSession) => void;
}

interface ClientToServerEvents {

}

type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const useSocket = defineStore("socket", () => {
    const route = useRoute();
    const connectedClients = useConnectedClientsStore();
    const session = useSessionStore();

    const socket: GameSocket = io(IO_URL, {
        autoConnect: false,
        auth: (cb) => {
            if (route.name === "game-page") {
                return cb({
                    gameLinkId: route.params.gameLinkId,
                    clientId: localStorage[`gameLink_${route.params.gameLinkId}`],
                });
            }
            cb({});
        },
    });

    socket.on("connect", () => {
        console.log("[socket] connect", socket)
    });

    socket.on("session", (session_) => {
        localStorage[`gameLink_${route.params.gameLinkId}`] = session_.clientId;
        session.data = session_;
    });

    socket.on("connected_clients", (clients) => {
        connectedClients.data = clients;
    });

    socket.on("connect_error", (error) => {
        console.log("[connect_error]", error);
    });

    return { socket };
})

export { useSocket };
