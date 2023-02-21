import { defineStore } from "pinia";
import { computed } from "vue";

import { sumDict } from "@/utils/sum";
import { useEventsStore } from "../events.store";
import { useGameDataStore } from "../game-data.store";
import { usePlayersStore } from "../players.store";
import { useScoresStore } from "../scores.store";
import { usePlayerMovesStore } from "../player-moves.store";
import { useMoveTokenStore } from "../move-token.store";
import { useTilesStore } from "../tiles.store";
import { useMoveDetail } from "@/composables/use-move-details";
import { useUpdatePlayerOrder } from "@/composables/use-player-order";

const usePlayState = defineStore("play-state", () => {
    const gameData = useGameDataStore();
    const events = useEventsStore();
    const scores = useScoresStore();
    const players = usePlayersStore();
    const tiles = useTilesStore();
    const playerMoves = usePlayerMovesStore();
    const moveToken = useMoveTokenStore();

    const updatePlayerOrder = useUpdatePlayerOrder();

    const isTurnEndable = computed(() => {
        const playerOverloads = tiles.getPlayerOverloads(players.activePlayer.id);
        return (
            !moveToken.canCommit &&
            playerOverloads.length === 0 &&
            playerMoves.committedMoves.length > 0 &&
            scores.pointTotals[players.activePlayer.id] > 0
        );
    });

    const isLastTurnInRound = computed(
        () => players.activePlayerIndex === players.playerList.length - 1
    );

    const currentMove = computed(() => {
        if (moveToken.candidateId) {
            const {
                candidateDestTileIndex,
                candidateOriginTileIndex,
                hoveredTileIndex,
                resolvesOverload
             } = moveToken;
            const origin = candidateOriginTileIndex as number;
            const dest = hoveredTileIndex ?? candidateDestTileIndex as number;
            const tokenValue = gameData.tokens[moveToken.candidateId].value;
            return useMoveDetail({ origin, dest, tokenValue, resolvesOverload });
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
                ["scores:set_initial_round_tile_scores", scores.tileScoresTotals],
                ["players:shuffle_order", updatePlayerOrder()],
                ["tiles:set_degrading_tiles", tiles.getDegradingTiles()],
                ["rounds:next"],
                ["seasons:next"],
            );
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

    return { pickupToken, dropToken, commitMove, endTurn, isTurnEndable, helpMessage, currentMove };
});

export { usePlayState };
