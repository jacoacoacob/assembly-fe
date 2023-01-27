import { isGame } from "@/stores/game-data-store-types";
import { remove, load, listKeys, save } from "@/storage";

import type { Game } from "@/stores/game-data-store-types";
import type { Game as GameV2 } from "@/stores-v2/game-data.types";

type GameList = Pick<Game, "name" | "players" | "ts_updated">[];

function listGames() {
    return listKeys();
}

function loadGame(name: string) {
    return load<Game>(name);
}

function saveGame(game: Game) {
    game.ts_updated = new Date().toISOString();
    save(game.name, game);
}

function saveGameHistory(game: GameV2) {
    save(game.name, game.history);
}

function loadGameHistory(name: string) {
    return load<GameV2["history"]>(name);
}

function deleteGame(name: string) {
    const game = load(name);
    if (isGame(game)) {
        remove(name);
    }
}

export { listGames, deleteGame, saveGame, loadGame, saveGameHistory, loadGameHistory };
export type { GameList };
