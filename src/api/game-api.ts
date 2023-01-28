
import { remove, load, listKeys, save } from "@/storage";

import type { Game } from "@/stores-v2/game-data.types";

type GameList = Pick<Game, "name" | "players" | "ts_updated">[];

function listGames() {
    return listKeys();
}

function saveGameHistory(game: Game) {
    save(game.name, game.history);
}

function loadGameHistory(name: string) {
    return load<Game["history"]>(name);
}

function deleteGame(name: string) {
    remove(name);
}

export { listGames, deleteGame, saveGameHistory, loadGameHistory };
export type { GameList };
