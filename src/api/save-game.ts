import { save } from "@/storage";
import { useGameStore } from "@/stores/game";

function saveGame() {
    const { history, name, players } = useGameStore();
    save(name, { history, name, players });
}

export { saveGame };
