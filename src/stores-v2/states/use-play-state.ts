import { sumDict } from "@/utils/sum";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useEventsStore } from "../events.store";
import { useGameDataStore } from "../game-data.store";
import { usePlayersStore } from "../players.store";
import { useScoresStore } from "../scores.store";
import { useTilesStore } from "../tiles.store";
import { useTokensStore } from "../tokens.store";
import { useScoring } from "../composables/use-scoring";
// import { usePlayerActions } from "../composables/use-player-actions";


const usePlayState = defineStore("play-state", () => {
    const gameData = useGameDataStore();
    const events = useEventsStore();
    const tokens = useTokensStore();
    const tiles = useTilesStore();
    const scores = useScoresStore();
    const players = usePlayersStore();
    
    const scoring = useScoring();
    // const playerActions = usePlayerActions();


    const isLastTurnInRound = computed(
        () => players.activePlayerIndex === gameData.players.length - 1
    );

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

    function startMove(tokenId: string) {
        if (tokenId !== tokens.candidateTokenId) {
            events.send("tokens:set_candidate_token_id", tokenId);
        }
    }

    function endMove(tokenId: string, tileIndex: number) {
        const token = gameData.tokens[tokenId];
        if (token.tileIndex === -1 && token.tileIndex === tileIndex) {
            events.send("tokens:set_candidate_token_id", "");
        }
        if (token.tileIndex !== tileIndex) {
            events.send("tokens:move_token", { tokenId, tileIndex });
            if (tileIndex === -1) {
                events.send("tokens:set_candidate_token_id", "");
            }
        }
        tokens.draggedTokenId = "";
    }

    return { startMove, endMove, endRound, endTurn };
});

export { usePlayState };
