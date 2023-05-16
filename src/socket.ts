import { Socket, io } from "socket.io-client";
import { useRoute } from "vue-router";

import { registerSessionHandlers } from "./v2/handlers/session-handlers";
import { setupSessionEmitters } from "./v2/emitters/session-emitters";
import type { ClientSession } from "./v2/stores/session-store";
import type { Game } from "./v2/stores/game-store";
import { lRef } from "./v2/composables/use-listen-emit-ref";

const IO_URL = import.meta.env.VITE_IO_URL;

interface ServerToClientEvents {
    "session:client_id": (data: ClientSession["clientId"]) => void;
    "session:all": (data: ClientSession[]) => void;
    "game": (data: any) => void;
};

interface ClientToServerEvents {
    "session:set_client_display_name": (name: string) => void;
    "session:claim_player": (playerId: string) => void;
    "game:add_player": (name: string) => void;
    "game:set_display_name": (name: string) => void;
    "game:event": (data: any) => void;
    "game:start": () => void;
    "game:end": () => void;
};


interface ListenEmitEvents {
    "game:start": () => void;
    "game:end": () => void;
}

interface ListenEvents extends ListenEmitEvents {
    "game": (data: Game) => void;
    "session:all": (data: ClientSession[]) => void;
    "session:client_id": (clientId: string) => void;
}

interface EmitEvents extends ListenEmitEvents {
    "game:add_player": (name: string) => void;
    "game:set_display_name": (name: string) => void;
}

type GameSocket = Socket<ListenEvents, EmitEvents>;

const socket: GameSocket = io(IO_URL, {
    autoConnect: false,
});

const hi = lRef("session:all");

function connectSocket() {
    const route = useRoute();

    socket.auth = (cb) => {
        return cb({
            gameLinkId: route.params.gameLinkId,
            clientId: localStorage[`glid_${route.params.gameLinkId}`],
        });
    };

    socket.on("connect", () => {
        console.log("[socket] connect", socket)
    });
    
    socket.on("connect_error", (error) => {
        console.log("[connect_error]", error);
    });
    
    registerSessionHandlers(socket);
    
    setupSessionEmitters(socket);

    socket.on

    socket.connect();
}

export { socket, connectSocket };
export type { GameSocket, ListenEvents, EmitEvents, ListenEmitEvents };
