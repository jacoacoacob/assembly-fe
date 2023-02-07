import { defineStore } from "pinia";
import { computed } from "vue";
import { selectRandomFrom } from "@/utils/rand";
import { useEventsStore } from "../events.store";
import { useGameDataStore } from "../game-data.store";
import { usePlayersStore } from "../players.store";
import { useTilesStore } from "../tiles.store";
import { useTokensStore } from "../tokens.store";
import { useScoring } from "../../composables/use-scoring";
import { usePlayerMovesStore } from "../player-moves.store";
import { useMoveTokenStore } from "../move-token.store";

const usePlaceTokensState = defineStore("place-tokens-state", () => {
    const gameData = useGameDataStore();
    const events = useEventsStore();
    const tokens = useTokensStore();
    const players = usePlayersStore();
    const tiles = useTilesStore();
    const scoring = useScoring();
    const playerMoves = usePlayerMovesStore();

    const moveToken = useMoveTokenStore();

    const isTurnEndable = computed(() => {
        const dest = moveToken.candidateDestTileIndex;
        return typeof dest === "number" && dest > -1;
    });

    function pickupToken(tokenId: string) {
        moveToken.pickup(tokenId);
    }

    function dropToken() {
        moveToken.drop();
    }

    const helpMessage = computed(() => {
        if (isTurnEndable.value) {
            return 'Hit the spacebar or click the "end turn" button to end your turn.'
        }
        return "Move a token from your reserve to an open tile on the board."
    });

    function _isPlacementComplete() {
        const inPlayReserveTokens = tokens.inPlayTokenIds.filter(
            (tokenId) => tokens.reserveTokenIds.includes(tokenId)
        );
        return inPlayReserveTokens.length === 0;
    }

    function _startPlayState() {
        events.sendMany(
            ["game_state:set_state", "play"],
            ["tiles:set_in_play_tiles", gameData.tiles.map((_, i) => i)],
            ["tokens:set_in_play_token_ids", Object.keys(gameData.tokens)],
            ["scores:set_points", scoring.scoreTiles()]
        );
    }

    function endTurn() {
        if (!isTurnEndable.value) {
            return;
        }
        console.log("Helllo")
        moveToken.commit()
        events.sendMany(["players:next"]);
        console.log("after players:next")
        players.viewActivePlayer();
        if (_isPlacementComplete()) {
            _startPlayState();
        } else if (!playerMoves.canPlaceToken) {
            events.send(
                "tiles:set_in_play_tiles",
                tiles.inPlayTiles.concat(
                    selectRandomFrom(
                        gameData.tiles.map((_, i) => i).filter(
                            (tileIndex) => !tiles.openInPlayTiles.includes(tileIndex)
                        ),
                        2
                    )
                )
            )
        }
    }

    return { pickupToken, dropToken, endTurn, isTurnEndable, helpMessage };
})

export { usePlaceTokensState };
