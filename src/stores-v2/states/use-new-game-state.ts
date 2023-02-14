import { defineStore } from "pinia";

import { randId, randFromRange, shuffle } from "@/utils/rand";
import type {  Game, Player, Token } from "../game-data.types";
import type { PlayerTokenIds } from "../tokens.types";
import { useEventsStore } from "../events.store";
import { useTokensStore } from "../tokens.store";
import { nextTick } from "vue";

function getStagedTokenIds(playerTokensIds: PlayerTokenIds): Token["id"][] {
    return Object.entries(playerTokensIds).reduce((accum: Token["id"][], [playerId, playerTokenIds]) => {
        const playerTokens: Token["id"][] = [];
        while (playerTokens.length < 6) {
            const tokenId = playerTokenIds[randFromRange(0, playerTokenIds.length - 1)];
            if (playerTokens.includes(tokenId)) {
                continue;
            }
            playerTokens.push(tokenId);
        } 
        return accum.concat(playerTokens);
    }, []);
}

function createTokens(players: Record<Player["id"], Player>): Game["tokens"] {
    const tokenValues = Array.from(Array(4)).map((_, i) => i + 1);

    const tokens: Game["tokens"] = {};

    function generateToken(playerId: string, value: number, tileIndex: number): Token {
        const token: Token = { value, playerId, tileIndex, id: randId(8) };
        if (tokens[token.id]) {
            return generateToken( playerId, value, tileIndex);
        }
        return token;
    }

    Object.values(players).forEach((player) => {
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

    function createGame(name: string, players: Record<Player["id"], Player>) {
        events.sendMany(
            ["game_data:set_name", name],
            ["game_data:set_players", players],
            ["game_data:set_tokens", createTokens(players)],
            ["game_data:set_grid", createGrid(6, 9, 90)],
            ["game_data:set_tiles", createTiles(
                6,
                9,
                Object.keys(players).length < 4 ? [5, 10] : [6, 12]
            )],
            ["players:shuffle_order", shuffle(Object.keys(players))],
            // ["tiles:set_in_play_tiles", [10, 13, 16, 37, 40, 43]],
            ["tiles:set_in_play_tiles", [10, 13, 16, 37, 40, 43]],
            ["game_state:set_state", "place_tokens"]
        );
        nextTick(() => {
            events.send("tokens:set_in_play_token_ids", getStagedTokenIds(tokens.playerTokenIds));
        });
    }

    return { createGame };
});

export { useNewGameState };
