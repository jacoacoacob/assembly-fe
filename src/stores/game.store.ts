import { defineStore } from "pinia";

import { randFromRange, randId } from "@/utils/rand";
import type { Game, Player, PlayerColor, Token } from "./game";
import { saveGame } from "@/api/game-api";

function createInitialGameState(rows: number, cols: number, tileSize: number): Game {
    return {
        name: "",
        history: [],
        players: [],
        grid: { rows, cols, tileSize },
        tokens: {},
        tiles: Array.from(Array(rows * cols)).map(() => ({
            threshold: randFromRange(5, 15),
            color: [
                randFromRange(220, 255),
                randFromRange(220, 255),
                randFromRange(220, 255),
            ]
        })),
        ts_updated: new Date().toISOString(),
    }
}

const useGameStore = defineStore("game", {
    state: () => createInitialGameState(6, 9, 90),
    actions: {
        addPlayer(name: string, color: PlayerColor) {
            const player: Player = { id: randId(8), name, color };
            if (this.players.some(p => p.id === player.id)) {
                this.addPlayer(name, color);
            } else {
                this.players.push(player);
                this.addToken(player.id, randFromRange(1, 4), 14);
                this.addToken(player.id, randFromRange(1, 4), 14);
            }
        },
        addToken(player: Player["id"], value: number, tileIndex: number) {
            const token: Token = { value, player, tileIndex, id: randId(8) };
            if (this.tokens[token.id]) {
                this.addToken(player, value, tileIndex);
            } else {
                this.tokens[token.id] = token;
            }
        },
        moveToken(tokenId: Token["id"], tileIndex: number) {
            const token = this.tokens[tokenId];
            if (token) {
                token.tileIndex = tileIndex;
            }
            saveGame(this.$state);
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
        tokenReserves(state) {
            return Object.entries(state.tokens).reduce(
                (accum: Record<Player["id"], Token["id"][]>, [tokenId, token]) => {
                    if (token.tileIndex < 0) {
                        if (!accum[token.player]) {
                            accum[token.player] = [];
                        }
                        accum[token.player].push(tokenId);
                    }
                    return accum;
                },
                {}
            );
        },
    }
});

export { useGameStore };
