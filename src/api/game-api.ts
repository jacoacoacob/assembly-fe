import { isGame } from "@/stores/game";
import { remove, load, listKeys, save } from "@/storage";

import type { Game } from "@/stores/game";

type GameList = Pick<Game, "name" | "players" | "ts_updated">[];

function listGames() {
    return listKeys().reduce((accum: GameList, key) => {
        const game = load<Game>(key);
        if (game) {
            accum.push({
                name: game.name,
                players: game.players,
                ts_updated: game.ts_updated,
            });
        }
        return accum
    }, []);
}

function loadGame(name: string) {
    return load<Game>(name);
}

function saveGame(game: Game) {
    game.ts_updated = new Date().toISOString();
    save(game.name, game);
}

function deleteGame(name: string) {
    const game = load(name);
    if (isGame(game)) {
        remove(name);
    }
}

export { listGames, deleteGame, saveGame, loadGame };
export type { GameList };
