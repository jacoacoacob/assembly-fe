import { sumDict } from "@/utils/sum";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useEventsStore } from "../events.store";
import { useGameDataStore } from "../game-data.store";
import { usePlayersStore } from "../players.store";
import { useScoresStore } from "../scores.store";
import { useTilesStore } from "../tiles.store";
import { useTokensStore } from "../tokens.store";
import { useScoring } from "../../composables/use-scoring";
import { usePlayerActionsStore, type PlayerAction } from "../player-actions.store";
import { useMoveTokenStore } from "../move-token.store";


const usePlayState = defineStore("play-state", () => {
    const gameData = useGameDataStore();
    const events = useEventsStore();
    const tokens = useTokensStore();
    const tiles = useTilesStore();
    const scores = useScoresStore();
    const players = usePlayersStore();
    const actions = usePlayerActionsStore();
    
    const scoring = useScoring();
    const moveToken = useMoveTokenStore();

    const selectedAction = ref<PlayerAction | null>(null);

    const availableActions = computed(
        (): PlayerAction[] => [
            actions.canPlaceToken && "place_token",
            actions.canMoveToken && "move_token",
            actions.canRemoveToken && "remove_token",
        ].filter(Boolean) as PlayerAction[]
    );

    const isLastTurnInRound = computed(
        () => players.activePlayerIndex === gameData.players.length - 1
    );

    const inProgressAction = computed((): PlayerAction | null => {
        if (moveToken.candidateId) {
            const origin = moveToken.candidateOriginTileIndex;
            const dest = moveToken.hoveredTileIndex ?? moveToken.candidateDestTileIndex;
            if (origin === -1) {
                return "place_token"
            } else if (dest === -1) {
                return "remove_token";
            } else {
                return "move_token";
            }
        }
        return null;
    });

    const helpMessage = computed(() => {
        const action = inProgressAction.value;
        const token = gameData.tokens[moveToken.movingTokenId];
        if (action && token) {
            switch (action) {
                case "move_token": return "Drop the token on any open tile.";
                case "place_token": return "Drop the token on any open tile.";
                case "remove_token": return `
                    Drop the token in your reserve and receive its value (${token.value}) in points
                `
            }
        } else {

        }
        return "";
    })

    function endRound() {
        events.send("scores:set_points", sumDict(scores.points, scoring.calculatePoints()));
    }

    function endTurn() {
        if (isLastTurnInRound.value) {
            endRound();
        }
        events.send("players:next");
        players.viewActivePlayer();
        moveToken.commit();
    }


    function pickupToken(tokenId: string) {
        moveToken.pickup(tokenId);
    }

    function dropToken() {
        moveToken.drop();
    }



    return { pickupToken, dropToken, endRound, endTurn, availableActions, selectedAction, helpMessage, inProgressAction };
});

export { usePlayState };
