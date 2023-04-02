import { io } from "socket.io-client";

const IO_URL = import.meta.env.VITE_IO_URL;

const socket = io(IO_URL, { autoConnect: false });
const authenticatedSocket = io(IO_URL + "/authenticated", { autoConnect: false });

export { socket, authenticatedSocket };
