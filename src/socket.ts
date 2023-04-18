
import { defineStore } from "pinia";
import { Socket, io } from "socket.io-client";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { fetchCreateClientAuthToken } from "./api-v2/fetchers";
import type { CreateClientAuthTokenRepsonse } from "./api-v2/types";

type ConnectionError =
    "unauthorized" |
    "invalid_game_token" |
    "invalid_session_token" |
    "missing_session_token" |
    "missing_game_token";

const IO_URL = import.meta.env.VITE_IO_URL;

interface ServerToClientEvents {
    clients: (clients: any) => void;
}

interface ClientToServerEvents {

}

type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const useSocket = defineStore("socket", () => {
    const route = useRoute();

    const socket: GameSocket = io(IO_URL, {
        autoConnect: false,
        auth: (cb) => {
            if (route.name === "game-page") {
                return cb({
                    gameToken: route.params.token,
                    clientToken: localStorage.clientToken,
                });
            }
            cb({});
        },
    });

    const connectionError = ref<ConnectionError | null>(null);

    watch(connectionError, async (newVal) => {
        if (newVal === "missing_session_token" || newVal === "invalid_session_token") {
            const response = await fetchCreateClientAuthToken({
                gameToken: route.params.token as string,
            });
            const data: CreateClientAuthTokenRepsonse = await response.json();
            localStorage.clientToken = data.clientToken;
            socket.connect();
        }
        if (newVal === "invalid_game_token") {
            console.log("Invalid game token!");
        }
    });

    socket.on("connect", () => {
        console.log("[socket] connect")
    });

    socket.on("connect_error", (error) => {
        connectionError.value = error.message as ConnectionError;
    });

    return { socket };
})

export { useSocket };
