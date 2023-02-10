import { sumDict } from "@/utils/sum";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useEventsStore } from "../events.store";
import { useGameDataStore } from "../game-data.store";
import { usePlayersStore } from "../players.store";
import { useScoresStore } from "../scores.store";
import { usePlayerMovesStore, type MoveKind } from "../player-moves.store";
import { useMoveTokenStore } from "../move-token.store";
import { useMoveDetail } from "@/composables/use-move-details";


const usePlayState = defineStore("play-state", () => {
    const gameData = useGameDataStore();
    const events = useEventsStore();
    const scores = useScoresStore();
    const players = usePlayersStore();
    const playerMoves = usePlayerMovesStore();
    
    const moveToken = useMoveTokenStore();

    const isTurnEndable = computed(() => {
        return !moveToken.canCommit && playerMoves.committedMoves.length > 0;
    });

    const isLastTurnInRound = computed(
        () => players.activePlayerIndex === players.playerList.length - 1
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

    const currentMove = computed(() => {
        if (moveToken.candidateId) {
            const origin = moveToken.candidateOriginTileIndex as number;
            const dest = moveToken.hoveredTileIndex ?? moveToken.candidateDestTileIndex as number;
            const tokenValue = gameData.tokens[moveToken.candidateId].value;
            return useMoveDetail({ origin, dest, tokenValue });
        }
    })

    const helpMessage = computed(() => {
        if (currentMove.value) {
            return currentMove.value.detail;
        }
        return "";
    });

    function endTurn() {
        if (!isTurnEndable.value) {
            return;
        }
        if (isLastTurnInRound.value) {
            events.sendMany(
                ["scores:set_point_totals", sumDict(
                    scores.pointTotals,
                    scores.tileScoresTotals
                )],
                ["scores:set_initial_round_tile_scores", scores.tileScoresTotals]
            )
        }
        events.send("players:next");
        players.viewActivePlayer();
    }

    function commitMove() {
        if (moveToken.canCommit) {
            moveToken.commit();
        }
    }

    function pickupToken(tokenId: string) {
        moveToken.pickup(tokenId);
    }

    function dropToken() {
        moveToken.drop();
    }

    return { pickupToken, dropToken, commitMove, endTurn, isTurnEndable, helpMessage, currentAction, currentMove };
});

export { usePlayState };
