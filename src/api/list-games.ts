
import { listKeys, load } from "@/storage";
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

export { listGames };
export type { GameList };
