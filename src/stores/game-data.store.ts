import { defineStore } from "pinia";

import { randFromRange, randId } from "@/utils/rand";
import type { Game, GameEvent, Player, PlayerColor, Token } from "./game-data";
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
        })),
        ts_updated: new Date().toISOString(),
    }
}

function addPlayer(store: GameDataStore, ) {

}

const useGameDataStore = defineStore("game-data", {
    state: () => createInitialGameState(6, 9, 90),
    actions: {
        pushEvent(event: GameEvent) {
            this.history.push(event);
        },
        addPlayer(name: string, color: PlayerColor) {
            addPlayer(this, );
            const player: Player = { id: randId(8), name, color };
            if (this.players.some(p => p.id === player.id)) {
                this.addPlayer(name, color);
            } else {
                this.players.push(player);
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
        lastEvent(state) {
            return state.history[state.history.length - 1];
        }
    }
});

type GameDataStore = ReturnType<typeof useGameDataStore>;
type GameData = ReturnType<typeof useGameDataStore>["$state"];

export { useGameDataStore };
export type { GameDataStore, GameData };
