
function makeFetcher<Body>(path: string, options?: Omit<RequestInit, "body">) {
    return (body?: Body) => fetch(import.meta.env.VITE_API + path, {
        ...options,
        body: typeof body === "undefined" ? undefined : JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
            ...options?.headers
        }
    })
}

const fetchCreateGame = makeFetcher("/game", {
    method: "POST",
});

const fetchCreateClientAuthToken = makeFetcher<{
    token: string;
}>("/game/token", {
    method: "POST",
});

export { fetchCreateGame, fetchCreateClientAuthToken };
