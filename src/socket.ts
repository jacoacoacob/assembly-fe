import { Socket, io } from "socket.io-client";
import { useRoute } from "vue-router";

import type { ClientSession } from "./v2/stores/session-store";
import type { GameMeta, GameHistoryEvent, GamePlayer, GameLink } from "./v2/stores/game-store";
import { ACK_TIMEOUT_DEFAULT } from "./v2/composables/use-socket-ref";
import type { ArgsType } from "./v2/composables/use-socket-ref";

const IO_URL = import.meta.env.VITE_IO_URL;

interface AckPayload {
    success: boolean;
    message?: string;
}

type Ack<IsSender extends boolean = false> = IsSender extends true
    ? (...args: [Error | null, AckPayload]) => void
    : (...args: [AckPayload]) => void;

type EmitWithAck<Data> = (data: Data, ack: Ack<true>) => void;
type ReceiveWithAck<Data> = (data: Data, ack: Ack) => void;

interface ListenEvents {
    "game:meta": (data: GameMeta) => void;
    "game:players": (data: GamePlayer[]) => void;
    "game:links": (data: GameLink[]) => void;
    "game_history:events": (data: GameHistoryEvent[]) => void;
    "game_history:events:append": (data: GameHistoryEvent[]) => void;
    "game_history:updated": (data: string) => void;
    "session:all": (data: ClientSession[]) => void;
    "session:client_id": (clientId: string) => void;
}

interface EmitEvents {
    "session:set_client_display_name": (name: string) => void;
    "session:claim_player": (data: { playerId: string }) => void;
    "session:unclaim_player": (data: { playerId: string }) => void;
    "game_meta:set_phase": (phase: GameMeta["phase"]) => void;
    "game:set_display_name": (name: string) => void;
    "game:add_player": EmitWithAck<{ name: string; assignToSender: boolean }>
    "game:remove_player": EmitWithAck<{ playerId: string }>;
    "game:update_player_name": EmitWithAck<{ playerId: string, name: string }>;
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
        console.log("[socket] connected");
    });

    socket.on("connect_error", (error) => {
        console.log("[socket] connection error", error);
    });

    socket.connect();
}

function emit<E extends keyof EmitEvents, T extends ArgsType<EmitEvents[E]>>(
    event: E,
    data: T[0]
) {
    (socket as any).emit(event, data);
}

async function emitWithAck<
    E extends keyof EmitEvents,
    T extends ArgsType<EmitEvents[E]>
>(event: E, data: T[0]): Promise<AckPayload> {
    return new Promise((resolve, reject) => {
        const acknowledgement: Ack<true> = (error, payload) => {
            if (error) {
                reject(error);
            }
            resolve(payload);
        };

        (socket as Socket)
            .timeout(ACK_TIMEOUT_DEFAULT)
            .emit(event, data, acknowledgement);
    });
}

export { socket, emit, emitWithAck, connectSocket };
export type { GameSocket, ListenEvents, EmitEvents, Ack, AckPayload };
