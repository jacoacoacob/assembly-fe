import { socket } from "@/socket";
import { useSessionStore } from "../stores/session-store";
import { useGameStore } from "../stores/game-store";


function useEmitters() {
    const session = useSessionStore();
    const game = useGameStore();

}