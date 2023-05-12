
interface GameLink {
    id: string;
    game_id: string;
    role: "guest" | "owner";
}

interface CreateGameResponse {
    ownerLink: GameLink;
    guestLink: GameLink;
}

interface CreateClientAuthTokenRepsonse {
    clientToken: string;
}

export type {
    GameLink,
    CreateGameResponse,
    CreateClientAuthTokenRepsonse,
};
