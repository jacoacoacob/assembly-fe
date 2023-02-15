import { useMoveDetail } from "@/composables/use-move-details";
import { sumDict } from "@/utils/sum";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useEventsStore } from "./events.store";
import { useGameDataStore } from "./game-data.store";
import type { Token } from "./game-data.types";
import { useGameStateStore } from "./game-state.store";
import { useMoveValidationStore } from "./move-validation.store";
import type { CommittedMove } from "./player-moves.store";
import { usePlayersStore } from "./players.store";
import { useScoresStore } from "./scores.store";
import { useTilesStore } from "./tiles.store";

/*

This store handles logic to move a token in the following ways

- pickup from reserve and drop on tile
- pickup from reserve and drop back on reserve
- pickup from tile and drop on reserve
- pickup from tile and drob back on same tile
- pickup from tile and drop on different tile 

*/

const useMoveTokenStore = defineStore("move-token", () => {
    const gameState = useGameStateStore();
    const gameData = useGameDataStore();
    const events = useEventsStore();
    const scores = useScoresStore();
    const tiles = useTilesStore();
    const players = usePlayersStore();
    const validation = useMoveValidationStore();

    const hoveredTileIndex = ref<number | null>(null);
    
    const movingTokenId = ref<Token["id"]>("");
    
    const resolvesOverload = ref(false);
    
    const candidateId = ref<Token["id"]>("");
    const candidateOriginTileIndex = ref<Token["tileIndex"] | null>(null);
    const candidateDestTileIndex = ref<Token["tileIndex"] | null>(null);
    
    const distance = computed(() => {
        const origin = candidateOriginTileIndex.value;
        if (typeof origin === "number") {
            const dest = hoveredTileIndex.value ?? candidateDestTileIndex.value as number;
            return validation.getDistance(origin, dest);
        }
        return null;
    });

    const cost = computed(() => {
        const origin = candidateOriginTileIndex.value as number;
        const dest = hoveredTileIndex.value ?? candidateDestTileIndex.value as number;
        if (typeof origin === "number" && typeof dest === "number") {
            const token = gameData.tokens[candidateId.value];
            return validation.getCost(token.value, origin, dest, resolvesOverload.value);
        }
        return null;
    });

    const isValid = computed((): boolean | null => {
        const dest = hoveredTileIndex.value;
        if (typeof dest === "number") {
            if (dest === candidateOriginTileIndex.value) {
                return true;
            }
            return validation.isValidMove(candidateId.value, dest);
        }
        return null;
    });

    function pickup(tokenId: string) {
        const token = gameData.tokens[tokenId];
        if (!token) {
            console.warn(`[useMoveStore::pickup] No token found with id "${token}"`);
            return;
        }
        if (candidateOriginTileIndex.value === null) {
            // It's possible that a player could pick up a token, drop it, and
            // then change their mind and pick it up again and drop it somewhere
            // else. We need to store the original position of the token so that
            // it can be recorded in the commit and used to calculate the cost
            // of moving the token.
            candidateOriginTileIndex.value = token.tileIndex;
            // track whether or not this move is resolving an overloaded tile
            const playerOverloads = tiles.getPlayerOverloads(token.playerId);
            resolvesOverload.value = playerOverloads.includes(token.tileIndex);
        }
        movingTokenId.value = tokenId;
        candidateId.value = tokenId;
    }


    function drop() {
        if (!isValid.value) {
            return;
        }
        movingTokenId.value = "";
        const tokenId = candidateId.value;
        const token = gameData.tokens[tokenId];
        if (!token) {
            console.warn(`[useMoveStore::drop] No token found with id "${tokenId}"`);
            return;
        }
        if (!hoveredTileIndex.value) {
            return;
        }
        const destTileIndex = hoveredTileIndex.value;
        gameData.moveToken(tokenId, destTileIndex);
        hoveredTileIndex.value = null;
        if (candidateOriginTileIndex.value === destTileIndex) {
            candidateOriginTileIndex.value = null;
            candidateDestTileIndex.value = null;
            candidateId.value = "";
            return;
        }
        candidateDestTileIndex.value = destTileIndex;
    }

    const canCommit = computed(() =>
        Boolean(gameData.tokens[candidateId.value]) &&
        candidateOriginTileIndex.value !== null && 
        candidateDestTileIndex.value !== null
    );

    /**
     * Compose and send appropriate events so that the token having been
     * moved is recoreded in game history.
     */
    function commit(){
        if (canCommit.value) {
            const candidateToken = gameData.tokens[candidateId.value];
            const move: CommittedMove = {
                origin: candidateOriginTileIndex.value as number,
                dest: candidateDestTileIndex.value as number,
                tokenValue: candidateToken.value,
                resolvesOverload: resolvesOverload.value,
            };
            events.sendMany(
                ["game_data:move_token", {
                    tokenId: candidateToken.id,
                    tileIndex: move.dest
                }],
                ["player_moves:commit", move],
            );
            if (gameState.currentState === "play") {
                const { cost, kind } = useMoveDetail(move);
                events.send("scores:set_point_totals", sumDict(
                    scores.pointTotals,
                    {
                        [players.activePlayer.id]: kind === "remove_token" && resolvesOverload.value ? 0 : cost,
                    }
                ))
            }
        }
        candidateId.value = "";
        candidateOriginTileIndex.value = null;
        candidateDestTileIndex.value = null;
    }

    return { pickup, drop, commit, canCommit, cost, distance, isValid, resolvesOverload, movingTokenId, candidateId, hoveredTileIndex, candidateOriginTileIndex, candidateDestTileIndex };
    
});

export { useMoveTokenStore };
