
interface GameLink {
    id: string;
    game_id: string;
    is_revoked: string;
    token: string;
}

interface CreateGameResponse {
    playerLink: GameLink;
    superPlayerLink: GameLink;
}

interface CreateClientAuthTokenRepsonse {
    token: string;
}

export type {
    GameLink,
    CreateGameResponse,
    CreateClientAuthTokenRepsonse,
};
