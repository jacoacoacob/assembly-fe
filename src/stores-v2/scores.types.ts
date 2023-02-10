import type { Player } from "./game-data.types";

type PlayerPoints = Record<Player["id"], number>;

interface TileScoreExplanation {
    capacity: number;
    tileTokenValuesSum: number;
    remainder: number;
    // tokenValueTotals: Record<string, number>;
    tokenValueTotals: { player: string; total: number }[];
    playerScores: { player: string; total: number }[];
}

export type { PlayerPoints, TileScoreExplanation };
