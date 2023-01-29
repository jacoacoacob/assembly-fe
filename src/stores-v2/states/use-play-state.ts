import { defineStore } from "pinia";
import { computed } from "vue";
import { useEventsStore } from "../events.store";
import { useGameDataStore } from "../game-data.store";
import { useScoresStore } from "../scores.store";
import { useTilesStore } from "../tiles.store";
import { useTokensStore } from "../tokens.store";

const usePlayState = defineStore("play-state", () => {
    const gameData = useGameDataStore();
    const events = useEventsStore();
    const tokens = useTokensStore();
    const tiles = useTilesStore();
    const points = useScoresStore();

    function _calculatePoints() {

    }

    function endRound() {
        // events.send("scores:set_points")
    }

    function endTurn() {

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

    return { startMove, endMove, endRound, endTurn  };
});

export { usePlayState };
