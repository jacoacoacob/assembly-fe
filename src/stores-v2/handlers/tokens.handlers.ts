import { eventHandlers } from "@/utils/event-handlers";
import { useGameDataStore } from "../game-data.store";
import { useTokensStore } from "../tokens.store";
import type { Event } from "../events.types";

type E<Name extends string, Data = {}> = Event<"tokens", Name, Data>;

type TokensEvent =
    E<"update_mature_token_ids", string[]> |
    E<"set_in_play_token_ids", string[]>;

function tokensEventHandlers() {
    const tokens = useTokensStore();

    return eventHandlers<"tokens", TokensEvent>({
        update_mature_token_ids(tokenIds) {
            tokens.updateMatureTokenIds(tokenIds);
        },
        set_in_play_token_ids(tokenIds) {
            tokens.inPlayTokenIds = tokenIds;
        },
    });
}

type TokensEventHandlers = ReturnType<typeof tokensEventHandlers>;

export { tokensEventHandlers };
export type { TokensEvent, TokensEventHandlers };
