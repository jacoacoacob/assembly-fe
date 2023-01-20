import type { Player, Token, Game} from "@/stores/game-data-store-types";
import { randFromRange, randId } from "@/utils/rand";

function createTokens(players: Player[]): Game["tokens"] {
    const tokenValues = Array.from(Array(4)).map((_, i) => i + 1);

    const tokens: Game["tokens"] = {};

    function generateToken(playerId: string, value: number, tileIndex: number): Token {
        const token: Token = { value, player: playerId, tileIndex, id: randId(8) };
        if (tokens[token.id]) {
            return generateToken( playerId, value, tileIndex);
        }
        return token;
    }

    players.forEach((player) => {
        for (let i = 0; i < 4; i++) {
            tokenValues.forEach(tokenValue => {
                const token = generateToken(player.id, tokenValue, -1);
                tokens[token.id] = token;
            });
        }
    });

    return tokens;
}

function createGrid(rows: number, cols: number, tileSize: number): Game["grid"] {
    return { rows, cols, tileSize };
}

function createTiles(rows: number, cols: number, capacityRange: [number, number]): Game["tiles"] {
    const [low, high] = capacityRange;
    return Array.from(Array(rows * cols)).map(() => ({
        capacity: randFromRange(low, high),
    }));
}

export { createTokens, createGrid, createTiles };