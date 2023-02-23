import { defineStore } from "pinia";

import { randId, randFromRange, shuffle, selectRandomFrom } from "@/utils/rand";
import type {  Game, Player, Token } from "../game-data.types";
import type { PlayerTokenIds } from "../tokens.types";
import { useEventsStore } from "../events.store";
import { useTokensStore } from "../tokens.store";
import { nextTick } from "vue";

function getStagedTokenIds(tokens: Game["tokens"], playerTokensIds: PlayerTokenIds): Token["id"][] {
    return Object.values(playerTokensIds).reduce(
        (accum: Token["id"][], playerTokensIds) => [
            ...accum,
            ...[1,2,3,4].map(
                (tokenValue) => playerTokensIds.find(
                    (tokenId) => tokens[tokenId].value === tokenValue
                ) as string
            )
        ],
        []
    );
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

const useNewGameState = defineStore("new-game-state", () => {
    const events = useEventsStore();
    const tokens = useTokensStore();

    function createGame(name: string, players: Record<Player["id"], Player>) {
        const tiles = createTiles(6, 9, [5, 10]);
        const grid = createGrid(6, 9, 90);
        const gameTokens = createTokens(players);
        events.sendMany(
            ["game_data:set_name", name],
            ["game_data:set_players", players],
            ["game_data:set_tokens", gameTokens],
            ["game_data:set_grid", grid],
            ["game_data:set_tiles", tiles],
            ["players:shuffle_order", shuffle(Object.keys(players))],
            ["game_state:set_state", "place_tokens"]
        );
        nextTick(() => {
            const tileIndeces = tiles.map((_, i) => i);
            events.sendMany(
                ["tokens:set_in_play_token_ids", getStagedTokenIds(gameTokens, tokens.playerTokenIds)],
                ["tiles:set_in_play_tiles", [
                    ...selectRandomFrom(tileIndeces.slice(0,             grid.cols * 2), 2),
                    ...selectRandomFrom(tileIndeces.slice(grid.cols * 2, grid.cols * 4), 2),
                    ...selectRandomFrom(tileIndeces.slice(grid.cols * 4, grid.cols * 6), 2),
                ]],
            );
        });
    }

    return { createGame };
});

export { useNewGameState };
