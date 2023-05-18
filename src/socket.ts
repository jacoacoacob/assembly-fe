import { Socket, io } from "socket.io-client";
import { useRoute } from "vue-router";

import type { ClientSession } from "./v2/stores/session-store";
import type { GameMeta, GameHistoryEvent, GamePlayer } from "./v2/stores/game-store";

const IO_URL = import.meta.env.VITE_IO_URL;
interface ListenEvents {
    "game:meta": (data: GameMeta) => void;
    "game:players": (data: GamePlayer[]) => void;
    "game:history": (data: GameHistoryEvent[]) => void;
    "session:all": (data: ClientSession[]) => void;
    "session:client_id": (clientId: string) => void;
}

interface EmitEvents {
    "session:set_client_display_name": (name: string) => void;
    "session:claim_player": (playerId: string) => void;
    "game:start": () => void;
    "game:end": () => void;
    "game:set_display_name": (name: string) => void;
    "game:add_player": (name: string) => void;
    "game:event": (event: GameHistoryEvent) => void;
}

type GameSocket = Socket<ListenEvents, EmitEvents>;

const socket: GameSocket = io(IO_URL, {
    autoConnect: false,
});

function connectSocket() {
    const route = useRoute();

    socket.auth = (cb) => {
        return cb({
            gameLinkId: route.params.gameLinkId,
            clientId: localStorage[`glid_${route.params.gameLinkId}`],
        });
    };

    socket.on("connect", () => {
        console.log("[socket] connected")
    });
    
    socket.on("connect_error", (error) => {
        console.log("[socket] connection error", error);
    });
    
    socket.connect();
}

export { socket, connectSocket };
export type { GameSocket, ListenEvents, EmitEvents };
