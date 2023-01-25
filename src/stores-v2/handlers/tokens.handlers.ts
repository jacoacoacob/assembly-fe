import { eventHandlers } from "@/utils/event-handlers";
import { useGameDataStore } from "../game-data.store";
import { useTokensStore } from "../tokens.store";
import type { Event } from "../events.types";

type E<Name extends string, Data = {}> = Event<"tokens", Name, Data>;

type TokensEvent =
    E<"move_token", { tokenId: string, tileIndex: number }> |
    E<"set_unplaceable_token_ids", string[]> |
    E<"set_candidate_id", string>;

function tokensEventHandlers() {
    const gameData = useGameDataStore();
    const tokens = useTokensStore();

    return eventHandlers<"tokens", TokensEvent>({
        move_token({ tokenId, tileIndex }) {
            gameData.moveToken(tokenId, tileIndex);
        },
        set_unplaceable_token_ids(tokenIds) {
            tokens.unplaceableTokenIds = tokenIds;
        },
        set_candidate_id(candidateId) {
            tokens.candidateId = candidateId;
        },
    });
}

type TokensEventHandlers = ReturnType<typeof tokensEventHandlers>;

export { tokensEventHandlers };
export type { TokensEvent, TokensEventHandlers };
