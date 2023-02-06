import { sumDict } from "@/utils/sum";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useEventsStore } from "../events.store";
import { useGameDataStore } from "../game-data.store";
import { usePlayersStore } from "../players.store";
import { useScoresStore } from "../scores.store";
import { useTilesStore } from "../tiles.store";
import { useTokensStore } from "../tokens.store";
import { useScoring } from "../../composables/use-scoring";
import { usePlayerMovesStore, type MoveKind } from "../player-moves.store";
import { useMoveTokenStore } from "../move-token.store";


const usePlayState = defineStore("play-state", () => {
    const gameData = useGameDataStore();
    const events = useEventsStore();
    const tokens = useTokensStore();
    const tiles = useTilesStore();
    const scores = useScoresStore();
    const players = usePlayersStore();
    const playerMoves = usePlayerMovesStore();
    
    const scoring = useScoring();
    const moveToken = useMoveTokenStore();

    const availableActions = computed(
        (): MoveKind[] => [
            playerMoves.canPlaceToken && "place_token",
            playerMoves.canMoveToken && "move_token",
            playerMoves.canRemoveToken && "remove_token",
        ].filter(Boolean) as MoveKind[]
    );


    const isTurnEndable = computed(() => {
        return playerMoves.committedMoves.length > 0;
    });

    const isLastTurnInRound = computed(
        () => players.activePlayerIndex === gameData.players.length - 1
    );

    const currentAction = computed((): MoveKind | null => {
        if (moveToken.candidateId) {
            const origin = moveToken.candidateOriginTileIndex;
            const dest = moveToken.hoveredTileIndex ?? moveToken.candidateDestTileIndex;
            if (origin === -1) {
                return "place_token"
            } else if (dest === -1) {
                return "remove_token";
            } else {
                return "move_token";
            }
        }
        return null;
    });

    const helpMessage = computed(() => {
        const action = currentAction.value;
        const token = gameData.tokens[moveToken.movingTokenId];
        if (action && token) {
            switch (action) {
                case "move_token": return "Drop the token on any open tile.";
                case "place_token": return "Drop the token on any open tile.";
                case "remove_token": return `
                    Drop the token in your reserve and receive its value (${token.value}) in points
                `
            }
        } else {

        }
        return "";
    });

    function endRound() {
        events.send("scores:set_points", sumDict(scores.points, scoring.calculatePoints()));
    }

    function endTurn() {
        if (isLastTurnInRound.value) {
            endRound();
        }
        events.send("players:next");
        players.viewActivePlayer();
    }

    function commitMove() {
        moveToken.commit();
    }

    function pickupToken(tokenId: string) {
        moveToken.pickup(tokenId);
    }

    function dropToken() {
        moveToken.drop();
    }

    return { pickupToken, dropToken, commitMove, endRound, endTurn, isTurnEndable, availableActions, helpMessage, currentAction };
});

export { usePlayState };
