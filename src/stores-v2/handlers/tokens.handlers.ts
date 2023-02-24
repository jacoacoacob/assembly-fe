import { eventHandlers } from "@/utils/event-handlers";
import { useTokensStore } from "../tokens.store";
import type { Event } from "../events.types";

type E<Name extends string, Data = {}> = Event<"tokens", Name, Data>;

type TokensEvent =
    E<"update_aging_tokens", string[]> |
    E<"set_token_ages", { tokenId: string; age: number }[]> |
    E<"delete_token_age", { tokenId: string }> |
    E<"set_in_play_token_ids", string[]>;

function tokensEventHandlers() {
    const tokens = useTokensStore();

    return eventHandlers<"tokens", TokensEvent>({
        set_token_ages(tokenAges) {
            tokenAges.forEach(({ tokenId, age }) => {
                tokens.setTokenAge(tokenId, age);
            });
        },
        delete_token_age({ tokenId }) {
            tokens.deleteTokenAge(tokenId);
        },
        update_aging_tokens(tokenIds) {
            tokens.updateAgingTokens(tokenIds);
        },
        set_in_play_token_ids(tokenIds) {
            tokens.inPlayTokenIds = tokenIds;
        },
    });
}

type TokensEventHandlers = ReturnType<typeof tokensEventHandlers>;

export { tokensEventHandlers };
export type { TokensEvent, TokensEventHandlers };
