import { computed, isRef, type ComputedRef, type Ref } from "vue";

import { useMoveValidationStore } from "@/stores-v2/move-validation.store";
import type { CommittedMove, MoveKind } from "@/stores-v2/player-moves.store";

function tokenLocation(index: number) {
    if (index === -1) {
        return "your token reserve";
    }
    return `tile number ${index + 1}`;
}

function moveCost(cost: number) {
    if (cost > 0) {
        return `+${cost}`;
    }
    return `${cost}`;
}

function kind(move: CommittedMove): MoveKind {
    const { origin, dest } = move;
    if (origin === -1) {
        return "place_token";
    }
    if (dest === -1) {
        return "remove_token";
    }
    return "move_token";
}

interface MoveDetails {
    origin: number;
    dest: number;
    cost: number;
    costDisplay: string;
    kind: MoveKind;
    detail: string
}

function moveMapper(validation: ReturnType<typeof useMoveValidationStore>) {
    return (move: CommittedMove): MoveDetails => {
        const { origin, dest, tokenValue } = move;
        const cost = validation.getCost(tokenValue, origin, dest);
        return {
            origin,
            dest,
            cost,
            costDisplay: moveCost(cost),
            kind: kind(move),
            detail: `
                You moved a token from ${tokenLocation(origin)} to ${tokenLocation(dest)}.
                During scoring at the end of this round, this move will contribute ${moveCost(cost)}
                to your earned points.`
        }
    }
}

function useMoveDetail<
    Move extends CommittedMove | Ref<CommittedMove>,
    Details extends Move extends Ref<CommittedMove> ? ComputedRef<MoveDetails> : MoveDetails
>(
    move: Move
): Details {
    const validation = useMoveValidationStore();
    const mapMove = moveMapper(validation);

    if (isRef(move)) {
        return computed(() => mapMove(move.value)) as Details;
    }

    return mapMove(move) as Details;
}

function useMovesDetails<
    Moves extends CommittedMove[] | Ref<CommittedMove[]>,
    Details extends Moves extends Ref<CommittedMove[]> ? ComputedRef<MoveDetails[]> : MoveDetails[]
>(moves: Moves): Details {
    const validation = useMoveValidationStore();
    const mapMove = moveMapper(validation);

    if (isRef(moves)) {
        return computed(() => (moves.value).map(mapMove)) as Details;
    }

    return moves.map(mapMove) as Details;
}

export { useMovesDetails, useMoveDetail };
export type { MoveDetails };
