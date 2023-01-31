import { computed } from "vue";
import { useEventsStore } from "../events.store";
import { useGameDataStore } from "../game-data.store";
import type { Token } from "../game-data.types";
import { useTokensStore } from "../tokens.store";

function useMove() {
    const gameData = useGameDataStore();
    const events = useEventsStore();
    const tokens = useTokensStore();

    const canCommit = computed(() => {
        const candidateToken = gameData.tokens[tokens.candidateTokenId];
        return Boolean(candidateToken) && candidateToken.tileIndex > -1;
    });

    function pickupToken(tokenId: string) {
        tokens.draggedTokenId = tokenId;
    }

    function dropToken(destTileIndex: number) {
        const token = gameData.tokens[tokens.draggedTokenId];
        if (token.tileIndex === -1 && destTileIndex > -1) {
            // token was picked up from reserve and is droppped onto a tile
            tokens.candidateTokenId = token.id;
            gameData.moveToken(token.id, destTileIndex);
        } else if (token.tileIndex > -1 && destTileIndex === -1) {
            // token was picked up from tile and dropped on reserve
            tokens.candidateTokenId = "";
            gameData.moveToken(token.id, destTileIndex);
        } else if (token.tileIndex > -1 && token.tileIndex !== destTileIndex) {
            // token was picked up from tile and dropped on different tile
            gameData.moveToken(token.id, destTileIndex);
        }
        // Other scenarios include:
        // - token was picked up from and dropped back onto the same tile
        // - token was picked up from and and droppbed on onto the reserve
        tokens.draggedTokenId = "";
    }

    function commit() {
        if (tokens.candidateTokenId) {
            const candidateToken = gameData.tokens[tokens.candidateTokenId];
            events.sendMany(
                // This is a little hacky. But up above, we moved the token without
                // using the event dispatch system so, now that the player is sure they're
                // happy with the candidate token position, we need to make sure the move
                // is logged in the game history
                ["tokens:move_token", {
                    tokenId: candidateToken.id,
                    tileIndex: candidateToken.tileIndex,
                }],
                ["tokens:set_candidate_token_id", ""]
            )
        }
    }

    return { pickupToken, dropToken, commit, canCommit };
}

export { useMove };
