import { defineStore } from "pinia";

import { randId, randFromRange } from "@/utils/rand";
import type {  Game, Player, Token } from "../game-data.types";
import type { PlayerTokenIds } from "../tokens.types";
import { useEventsStore } from "../events.store";
import { useTokensStore } from "../tokens.store";

function getStagedTokenIds(playerTokensIds: PlayerTokenIds): Token["id"][] {
    return Object.entries(playerTokensIds).reduce((accum: Token["id"][], [playerId, playerTokenIds]) => {
        const playerTokens: Token["id"][] = [];
        while (playerTokens.length < 6) {
            const tokenId = playerTokenIds[randFromRange(0, playerTokenIds.length - 1)];
            if (playerTokens.includes(tokenId)) {
                continue;
            }
            playerTokenIds.push(tokenId);
        } 
        return accum.concat(playerTokens);
    }, []);
}

function createTokens(players: Player[]): Game["tokens"] {
    const tokenValues = Array.from(Array(4)).map((_, i) => i + 1);

    const tokens: Game["tokens"] = {};

    function generateToken(playerId: string, value: number, tileIndex: number): Token {
        const token: Token = { value, playerId, tileIndex, id: randId(8) };
        if (tokens[token.id]) {
            return generateToken( playerId, value, tileIndex);
        }
        return token;
    }

    players.forEach((player) => {
        for (let i = 0; i < 5; i++) {
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

const useNewGameState = defineStore("new-game-state", () => {
    const events = useEventsStore();
    const tokens = useTokensStore();

    function createGame(name: string, players: Player[]) {
        events.sendMany(
            ["new_game:set_name", name],
            ["new_game:set_players", players],
            ["new_game:set_tokens", createTokens(players)],
            ["new_game:set_grid", createGrid(6, 9, 90)],
            ["new_game:set_tiles", createTiles(6, 9, players.length < 4 ? [4, 8] : [5, 10])],
            ["tokens:set_in_play_token_ids", getStagedTokenIds(tokens.playerTokenIds)],
            ["game_state:set_state", "place_tokens"]
        )
    }

    return { createGame };
});

export { useNewGameState };
