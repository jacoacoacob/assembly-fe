<script setup lang="ts">
import { computed, inject, type StyleValue } from 'vue';

import { useGameStateStore } from '@/stores-v2/game-state.store';
import GameRulesSection from './GameRulesSection.vue';

const gameState = useGameStateStore();

const boardStyle = inject<{ board: StyleValue, tile: StyleValue }>("boardStyle");

const className = computed(() => ({
    "border-2": gameState.currentState === "place_tokens",
}));
</script>

<template>
    <div
        class="border-2 border-slate-500 box-content"
        :class="className"
        :style="boardStyle?.board"
    >
        <div class="p-2 h-full flex space-x-4">
            <section class="space-y-4">
                <h1 class="font-bold text-slate-700">
                    Contents
                </h1>
                <nav class="flex flex-col space-y-3 w-32 font-semibold text-sm">
                    <a href="#introduction">Introduction</a>
                    <nav class="space-y-2">
                        <h2>
                            <a href="#things-to-know">Things to know</a>
                        </h2>
                        <ul class="pl-4 space-y-2">
                            <li><a href="#things-to-know_tokens">tokens</a></li>
                            <li><a href="#things-to-know_tiles">tiles</a></li>
                            <li><a href="#things-to-know_tile-capacity">tile capacity</a></li>
                            <li><a href="#things-to-know_tile-scoring">tile scoring</a></li>
                        </ul>
                    </nav>
                </nav>
            </section>
            <section class="flex flex-col space-y-8 overflow-auto px-4 flex-1">
                <h1 class="font-bold flex flex-col self-center">
                    <span class="text-3xl text-center">Assemblage</span>
                    <span class="text-xl text-center text-slate-700">a game of mutual survival</span>
                </h1>

                <GameRulesSection heading="Introduction">
                    <p>
                        In this game, as in the rest of life, survival isn't a winner take all
                        brawl but a constant negotiation in relationship with others.
                    </p>
                    <p>
                        ...
                        <!-- Your goal is to get all of your tokens onto the board. Earning points
                        is key to success but be careful that your pursuit of points doesn't 
                        knock any other player out of the game. If this happens, it's game over
                        and everyone loses! -->
                    </p>
                </GameRulesSection>

                <GameRulesSection heading="Things to know">
                    <div class="space-y-6">
                        <section class="space-y-2">
                            <h3 id="things-to-know_tokens" class="text-lg font-bold">
                                Tokens
                            </h3>
                            <p>
                                Each player will controls 16 tokens. These are the round things which are
                                color coded by player and can be moved between the token reserve and tiles
                                on the board.
                            </p>
                        </section>
                        <section class="space-y-2">
                            <h3 id="things-to-know_tokens" class="text-lg font-bold">
                                Token value
                            </h3>
                            <p>
                                Each token displays a number in its center ranging from 1 to 4. This is its
                                <i>token value</i>.
                            </p>
                        </section>
                        <section class="space-y-2">
                            <h3 id="things-to-know_tiles" class="text-lg font-bold">
                                Tiles
                            </h3>
                            <p>
                                The board is made up of a 6X9 grid of tiles.
                            </p>
                        </section>
                        <section class="space-y-2">
                            <h3 id="things-to-know_tile-capacity" class="text-lg font-bold">
                                Tile capacity
                            </h3>
                            <p>
                                Each tile displays a number in its center. This is its <i>capacity</i>.
                                It is generated at random and will fluctuate depending on the season.
                            </p>
                            <p>
                                A tile may contain any combination of between 0 and 4 tokens as long 
                                as the sum of the token values does not exceed the tile's capacity.
                            </p>
                        </section>
                        <section class="space-y-2">
                            <h3 id="things-to-know_tile-scoring" class="text-lg font-bold">
                                Tile scoring
                            </h3>
                            <p>
                                During round-completion, points are calculated for each player in every
                                tile containing tokens and the totals are added to the players' running
                                point total.
                            </p>
                            <p>
                                Tiles containing tokens belonging to only 1 player will earn that player
                                -1 points.
                            </p>
                            <p>
                                In tiles containing tokens belonging to 2 or more players, points are
                                calculated for each of those players using thing following steps.
                            </p>
                            <ol class="space-y-1 list-decimal pl-4">
                                <li>
                                    Subtract the total value of all tokens in the tile from the tile's
                                    capacity, divide the result by 2 and round to the nearest whole
                                    number. Call this the <dfn>tile capacity modifier</dfn>.
                                </li>
                                <li>
                                    Find the total token value of each player's tokens in the tile.
                                    Call these the tile's <dfn>player token totals</dfn>.
                                </li>
                                <li>
                                    For every <i>player token total</i>, subtract each of the other 
                                    <i>player token totals</i> and add the results together. Then, add
                                    the <i>tile capacity modifier</i>. The result is the number of 
                                    points that the player will earn for this tile.
                                </li>
                            </ol>
                            <div class="bg-slate-200 p-2 rounded">
                                <h5 class="font-bold inline text-slate-600">Tip</h5>:
                                <em>
                                    You can click the <i class="font-semibold">tile capacity</i> display
                                    in each tile to see details about that tile including the scoring 
                                    for any player with tokens in it.
                                </em>
                            </div>
                        </section>
                    </div>
                </GameRulesSection>

                <!-- <GameRulesSection heading="Things to know">
                    <p>
                        In Assemblage, each player controls 16 
                        <dfn>tokens</dfn>.
                        Each token displays a number in its center. This is its
                        <dfn>token value</dfn>.
                    </p>
                    <p>
                        Throughout the game, players will move their tokens between their 
                        <span class="font-semibold">token reserve</span> (off of the board) and 
                        the <span class="font-semibold">tiles</span> (on the board). Each tile 
                        displays a number in its center. This is its 
                        <span class="font-semibold">tile capacity</span>.
                    </p>
                    <p>
                        Gameplay is broken into rounds during which each player must take at least one
                        <span class="font-semibold">action</span>. 
                        
                        With one exception, each action will
                        either 
                    </p>
                    <p>
                        Gameplay is broken into rounds during which each player each player must
                        take at least one <span class="font-semibold">action</span>. An action
                        involves moving a token from one tile to another (<i>move token</i>),
                        moving a token from the token reserve and placing it on a tile
                        (<i>place token</i>), or removing a token from a tile
                        and putting it back into the token reserve (<i>remove token</i>).
                        When a player 
                    </p>
                </GameRulesSection>

                <GameRulesSection heading="Setup">
                    <p>
                        Throughout the game, each player will control 16 tokens
                    </p>
                    <p>
                        During setup, 6 tokens are randomly selected from each players' token reserve
                        to be placed onto the board.

                        Players take turns placing these tokens one at a time onto open tiles. 
                        
                        When they are finished, the game moves into normal 
                        <span class="font-semibold">gameplay</span>.
                    </p>
                </GameRulesSection>

                <GameRulesSection heading="Gameplay">
                    <p>
                        ...
                    </p>
                </GameRulesSection>

                <GameRulesSection heading="Glossary">
                    <div class="space-y-1">
                        <h3 class="font-semibold text-lg italic">
                            token
                        </h3>
                        <p>
                            Each player controls 16 tokens. Each token displays a number in its center.
                            This is its <span class="font-semibold">token value</span>.
                        </p>
                    </div>
                    <div class="space-y-1">
                        <h3 class="font-semibold text-lg italic">
                            tile
                        </h3>
                        <p>
                            The board is made up of a 6X9 grid of tiles. Each tile displays a number in
                            its center. This is its <span class="font-semibold">capacity</span>.
                        </p>
                    </div>
                    <div class="space-y-1">
                        <h3 class="font-semibold text-lg italic">
                            rounds & round-completion
                        </h3>
                        <p>
                            Gameplay is broken into rounds during which each player takes a turn.
                            Round-completion occurs after each player has finished their turn and before
                            the next round starts. Tiles and 
                        </p>
                    </div>
    

                    <div class="space-y-1">
                        <h3 class="font-semibold text-lg italic">
                            rounds, turns & actions
                        </h3>
                        <p>
                            Gameplay unfolds in rounds during which each player must take at least one
                            action.
                        </p>
                    </div>
                    <div class="space-y-1">
                        <h3 class="font-semibold text-lg italic">
                            round-completion
                        </h3>
                        <p>
                            Gameplay unfolds in rounds during which each player must take at least one
                            action.
                        </p>
                    </div>
                </GameRulesSection> -->


                <!-- <GameRulesSection heading="Materials">
                    The 
                </GameRulesSection>

                <GameRulesSection heading="Setup">
                    <p>
                        The setup phase begins with 6 tiles
                    </p>
                </GameRulesSection> -->

                <!-- <GameRulesSection heading="Points">
                    <p>
                        Each round, players 
                    </p>
                </GameRulesSection>
                 -->
                <!-- <div id="introduction" class="space-y-2">
                    <h2 class="font-semibold text-lg">  
                        Introduction
                    </h2>
                    <p>
                        In this game, as in the rest of life, survival isn't a winner-take-all brawl
                        but a constant negotiation in relationship with others.
                    </p>
        
                    <p>
                        Each player's goal is to be to move all of their tokens onto the board
                        while taking care to not eliminate other players. A player is eliminated if
                        all of their tokens are removed from the board. When this happens 
                    </p>
                    <p>
                        The primary objective for each player is to earn points so that they are able
                        to move their tokens onto the board. Points can be earned 
                        
                        to get all of their tokens onto the
                        board while ensuring that other players aren't eliminated.
                        If one or more players finish three consecutive rounds with all of their tokens 
                        on the board, the game is over and all players with any tokens on the board win.
                        If all of a players tokens leave the board, that player is eliminated from the 
                        game. If all players but one are eliminated, the game is over and everyone loses.
                    </p>
                </div> -->

                <!-- <div id="the-tokens" class="space-y-2">
                    <h2 class="font-semibold text-lg">
                        The Tokens
                    </h2>
                    <p>
                        Each player has 20 tokens. Each token has number displayed in its center. This is
                        its <span class="font-bold text-slate-700">value</span>.
                    </p>
                </div> -->

                <!-- <div id="the-board" class="space-y-2">
                    <h2 class="font-semibold text-lg">
                        The Board
                    </h2>
                    <p>
                        The board is made up of a 6x9 grid of tiles. Each tile has a number displayed in
                        the center. This is its <span class="font-bold text-slate-700">capacity</span>.
                        The sum of all token values in a tile must be less than or equal to the tile's 
                        capacity and each tile can hold a maximum of 4 tokens.
                    </p>
                </div>

                <div id="setup" class="space-y-2">
                    <h2 class="font-semibold text-lg">
                        Setup
                    </h2>
                    <p>
                        During the setup phase. Each player takes turns place 6 tokens, randomly selected 
                        from their pool of 20 tokens, one at a time onto the board.
                    </p>
                    <p>
                        When all of the initially selected tokens are on the board, the tiles are scored
                        and gameplay begins.
                    </p>
                </div>

                <div id="gameplay" class="space-y-2">
                    <h2 class="font-semibold text-lg">
                        Gameplay
                    </h2>
                    <p>
                        Gameplay unfolds in rounds where each player takes a turn.
                    </p>
                    <p>
                        At the end of each round, the scores for each player are calculated and added
                        to th
                    </p>
                    <p>
                        
                        During their turn, a
                        player must take at least one action.
                    </p>
                    <p>
                        During gameplay, each player works to manuveur their tokens on the board in
                        such a way as to earn them points at the end of the round.
                    </p>

                    <p>
                    </p>
                    <p>
                        Gameplay unfolds over rounds during which each player must take at least 1
                        action. At the end of each round, tile scores are calculated and added to 
                        each players running point total.
                    </p>
                    <p>
                        The actions a player might take during their turn are
                    </p>
                    <ul class="list-disc pl-4 space-y-2">
                        <li>
                            <span class="p-1 bg-slate-200 rounded font-semibold text-sm">
                                place token
                            </span>: Move a token from your token reserve onto the board. This action
                            costs the token's value in points.
                        </li>
                        <li>
                            <span class="p-1 bg-slate-200 rounded font-semibold text-sm">
                                move token
                            </span>: Move a token from one tile on the board to another tile. This
                            action costs the token's value in points divided by 2 
                        </li>
                        <li>
                            <span class="p-1 bg-slate-200 rounded font-semibold text-sm">
                                remove token
                            </span>
                        </li>
                        
                    </ul>
                </div>

                
                <div id="end-of-round-scoring" class="space-y-2">
                    <h2 class="font-semibold text-lg">
                        End-of-round Scoring
                    </h2>
                    <p>
                        Each player has a running point total whose value might fluctuate between
                        negative and positive numbers. If a player's points remain below zero for too
                        long, they will be knocked out
                    </p>
                </div> -->
            </section> 
        </div>
    </div>
</template>