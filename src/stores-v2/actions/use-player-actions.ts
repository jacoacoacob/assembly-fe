import { useEventsStore } from "../events.store";
import { useGameDataStore } from "../game-data.store";
import { useGameStateStore } from "../game-state.store";
import { useTokensStore } from "../tokens.store";

function usePlayerActions() {
    const events = useEventsStore();
    const gameData = useGameDataStore();
    const tokens = useTokensStore();

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

    }

    return { startMove, endMove };
}

export { usePlayerActions };
