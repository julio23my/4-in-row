import { io } from "socket.io-client";

const socket_url = "http://127.0.0.1:5000/";

const socket = io(`${socket_url}game`, {
	withCredentials: true,
});

export default socket;
