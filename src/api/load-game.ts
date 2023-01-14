import { load } from "@/storage";
import { useGameStore } from "@/stores/game.store";
import type { Game } from "@/stores/game";

function loadGame(name: string) {
    const data = load<Game>(name);
    if (data) {
        const game = useGameStore();
        const { history, name, players } = data;
        game.history = history;
        game.name = name;
        game.players = players;
    }
}

export { loadGame };
