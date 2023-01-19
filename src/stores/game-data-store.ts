import { defineStore } from "pinia";

import { randFromRange, randId } from "@/utils/rand";
import type { Game, Player, PlayerColor, PlayerTokenIds, PlayerTokens, ReserveTokens, Token } from "./data-store-types";

function createInitialGameState(rows: number, cols: number, tileSize: number): Game {
    return {
        name: "",
        history: [],
        players: [],
        grid: { rows, cols, tileSize },
        tokens: {},
        tiles: Array.from(Array(rows * cols)).map(() => ({
            capacity: randFromRange(5, 15),
        })),
        ts_updated: new Date().toISOString(),
    }
}


const useGameDataStore = defineStore("game-data", {
    state: () => createInitialGameState(6, 9, 90),
    actions: {
        addPlayer(name: string, color: PlayerColor) {;
            const player: Player = { id: randId(8), name, color };
            if (this.players.some(p => p.id === player.id)) {
                this.addPlayer(name, color);
            } else {
                this.players.push(player);
            }
        },
        generateToken(player: Player["id"], value: number, tileIndex: number) {
            const token: Token = { value, player, tileIndex, id: randId(8) };
            if (this.tokens[token.id]) {
                this.generateToken(player, value, tileIndex);
            } else {
                this.tokens[token.id] = token;
            }
        },
        moveToken(tokenId: Token["id"], tileIndex: number) {
            const token = this.tokens[tokenId];
            if (token) {
                token.tileIndex = tileIndex;
            }
        },
    },
    getters: {
        board(state) {
            const graph: Token["id"][][] = state.tiles.map(() => []);
            const tokenEntries = Object.entries(state.tokens);
            for (let i = 0; i < tokenEntries.length; i++) {
                const [tokenId, token] = tokenEntries[i];
                if (token.tileIndex > -1) {
                    graph[token.tileIndex].push(tokenId);
                }
            }
            return graph;
        },
        playerTokenIds(state): PlayerTokenIds {
            return Object.values(state.tokens).reduce((accum: PlayerTokenIds, token) => {
                if (!accum[token.player]) {
                    accum[token.player] = [];
                }
                accum[token.player].push(token.id);
                return accum;
            }, {});
        },
        reserveTokenIds(state): Token["id"][] {
            return Object.keys(state.tokens).filter((tokenId) => state.tokens[tokenId].tileIndex === -1);
        },
        reserveTokens(state): ReserveTokens {
            return this.reserveTokenIds.reduce((accum: ReserveTokens, tokenId) => {
                const token = state.tokens[tokenId];
                if (!accum[token.player]) {
                    accum[token.player] = {};
                }
                if (!accum[token.player][token.value]) {
                    accum[token.player][token.value] = [];
                }
                accum[token.player][token.value].push(token);
                return accum;
            }, {})
        },
        lastEvent(state) {
            return state.history[state.history.length - 1];
        }
    }
});

type GameDataStore = ReturnType<typeof useGameDataStore>;
type GameData = ReturnType<typeof useGameDataStore>["$state"];

export { useGameDataStore };
export type { GameDataStore, GameData };
