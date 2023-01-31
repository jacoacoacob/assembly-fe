import { defineStore } from "pinia";

import { randId } from "@/utils/rand";
import type { Game, Player, PlayerColor, Token } from "./game-data.types";

const initialState: Game = {
    name: "",
    history: [],
    players: [],
    grid: { rows: 0, cols: 0, tileSize: 0 },
    tokens: {},
    tiles: [],
    ts_updated: new Date().toISOString(),
};

const useGameDataStore = defineStore("game-data", {
    state: () => initialState,
    actions: {
        addPlayer(name: string, color: PlayerColor) {;
            const player: Player = { id: randId(8), name, color };
            if (this.players.some(p => p.id === player.id)) {
                this.addPlayer(name, color);
            } else {
                this.players.push(player);
            }
        },
        generateToken(playerId: Player["id"], value: number, tileIndex: number) {
            const token: Token = { value, playerId, tileIndex, id: randId(8) };
            if (this.tokens[token.id]) {
                this.generateToken(playerId, value, tileIndex);
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
});

export { useGameDataStore, initialState };
