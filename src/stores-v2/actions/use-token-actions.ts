import { useEventsStore } from "../events.store";
import { useGameDataStore } from "../game-data.store";
import { useGameStateStore } from "../game-state.store";
import { useTokensStore } from "../tokens.store";

function useTokenActions() {
    const events = useEventsStore();
    const gameData = useGameDataStore();

    function startMove(tokenId: string) {
        events.send("tokens:set_candidate_id", tokenId);
    }

    function endMove(tokenId: string, tileIndex: number) {
        const token = gameData.tokens[tokenId];
        if (token.tileIndex !== tileIndex) {
            events.send(
                ["tokens:move_token", { tokenId, tileIndex }],
                ["tokens:set_candidate_id", ""],
            );
        }
    }

    return { startMove, endMove };
}

export { useTokenActions };
