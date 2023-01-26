import type { Player, Token } from "./game-data.types";

type PlayerTokenIds = Record<Player["id"], Token["id"][]>;
type PlayerTokenIdsByTokenValue = Record<Player["id"], Record<Token["value"], Token["id"][]>>;

export type { PlayerTokenIds, PlayerTokenIdsByTokenValue };
