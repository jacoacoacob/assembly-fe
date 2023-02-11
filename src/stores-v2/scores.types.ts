import type { Player } from "./game-data.types";

type PlayerPoints = Record<Player["id"], number>;

interface TileScoreExplanation {
    tileCapacity: number;
    tileCapacityRemainder: number;
    tileTokenValuesSum: number;
    tilePlayerIds: Player["id"][];
    tokenValueTotals: Record<Player["id"], number>;
    playerScores: Record<Player["id"], number>;

}

export type { PlayerPoints, TileScoreExplanation };
