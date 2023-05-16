import type { GameSocket } from "@/socket";
import { useSessionStore } from "../stores/session-store";

function setupSessionEmitters(socket: GameSocket) {
    const session = useSessionStore();
}

export { setupSessionEmitters };
