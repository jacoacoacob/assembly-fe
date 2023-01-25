import { defineStore } from "pinia";
import { useEventsStore } from "../events.store";
import { useGameDataStore } from "../game-data.store";
import { useGameStateStore } from "../game-state.store";
import { usePlayersStore } from "../players.store";
import { useTokensStore } from "../tokens.store";

/**
 * Functions and data to be used in components when gameState.currentState === "place_tokens"
 */
const usePlaceTokensState = defineStore("place-tokens-state", () => {
    const gameData = useGameDataStore();
    const events = useEventsStore();
    const tokens = useTokensStore();
    const players = usePlayersStore();

    function startMove(tokenId: string) {
        if (tokenId !== tokens.candidateId) {
            events.send("tokens:set_candidate_id", tokenId);
        }
    }

    function endMove(tokenId: string, tileIndex: number) {
        const token = gameData.tokens[tokenId];
        if (token.tileIndex === -1 && token.tileIndex === tileIndex) {
            events.send("tokens:set_candidate_id", "");
        }
        if (token.tileIndex !== tileIndex) {
            events.send("tokens:move_token", { tokenId, tileIndex });
            if (tileIndex === -1) {
                events.send("tokens:set_candidate_id", "");
            }
        }
    }

    function endTurn() {
        events.sendMany(
            ["players:next"],
            ["tokens:set_candidate_id", ""]
        );
        players.viewActivePlayer();
    }

    return { startMove, endMove, endTurn };
})

export { usePlaceTokensState };
