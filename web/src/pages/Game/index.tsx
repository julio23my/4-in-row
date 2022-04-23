import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { API_URL } from "../../utils/constants";
import { searchGame } from "../../utils/searchGame";
import socket from "../../utils/socket";
import "./game.css";
import { toast, Slide } from "react-toastify";

enum Player {
	None = 0,
	One = 1,
	Two = 2,
}

type BoardPlayers = Player[];

interface StateBoard {
	board: BoardPlayers[];
}

const initialBoard = (): BoardPlayers[] => {
	const board: BoardPlayers[] = [[]];
	for (let j = 0; j < 7; j++) {
		board[j] = [];
		for (let i = 0; i < 7; i++) {
			board[j].push(Player.None);
		}
	}
	console.log(board);
	return board;
};

type SquareProps = {
	onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
	value: string | null;
};

const Square: React.FC<SquareProps> = ({ onClick, value }) => (
	<button className="square" onClick={onClick}>
		{value}
	</button>
);

type BoardProps = {
	mode: "CREATE" | "JOIN";
	gameId: number;
};

type FetchGameResponse = {
	result: "fail" | "success";
	board: BoardPlayers[];
	next: 1 | 2;
};

type UpdateBoardResponse = {
	position: number;
	next: 1 | 2;
	player: any;
};

const showToast = (text: string) =>
	toast(text, {
		position: "bottom-center",
		hideProgressBar: true,
		draggable: false,
		autoClose: 5000,
		pauseOnHover: false,
		closeOnClick: true,
		transition: Slide,
	});

type LocationStateType = {
	gameId: number;
	mode: "CREATE" | "JOIN";
};

type SocketConnectedData = {
	game_id: string;
	online: string[];
};

const Game: React.FC<any> = () => {
	const [online, setOnline] = useState(0);
	const [board, setBoard] = useState<BoardPlayers[]>(initialBoard());
	const [enableRestart, setEnableRestart] = useState(false);
	const [xIsNext, setXIsNext] = useState(true);

	const getBoard = async () => {
		setEnableRestart(false);
		const res = await fetch(`${API_URL}api/fetch/game/${gameId}`);
		const data: any = await res.json();
		if (data.result === "success") {
			setBoard(data.board);
			setXIsNext(data.next === 1);
			const status = false;
			if (status) setEnableRestart(true);
		} else if (data.result === "fail") {
			history.replace({ pathname: "/" });
		}
	};

	const cell = (player: Player[], row: number): ReactElement[] => {
		const board = player.map((element: Player, index: number) => {
			const realIndex = `${row},${index}`;
			return (
				<div
					className="cell"
					key={realIndex}
					onClick={() => console.log(realIndex)}
					data-player={element}
				/>
			);
		});
		return board;
	};

	const location = useLocation();
	const history = useHistory();

	const connected = (data: SocketConnectedData) =>
		setOnline(data.online.length);

	const gameId = (location.state as LocationStateType)?.gameId;
	const mode = (location.state as LocationStateType)?.mode || "JOIN";
	const playingAs = mode === "CREATE" ? 1 : 2;

	const checkIfGameExists = async () => {
		const gameExists = await searchGame(gameId.toString());
		if (!gameExists) {
			history.replace({
				pathname: "/",
			});
		}
	};

	useEffect(() => {
		if (location.state !== undefined && gameId) checkIfGameExists();
	}, []);

	useEffect(() => {
		if (location.state !== undefined && gameId)
			socket.emit("join", {
				game_id: gameId,
				player: mode === "CREATE" ? Player.One : Player.Two,
			});

		socket.on("connected", connected);
		socket.on("disconnected", connected);
		return () => {
			socket.emit("leave", {
				game_id: gameId,
				player: mode === "CREATE" ? Player.One : Player.Two,
			});
			socket.off("connected");
		};
	}, []);

	if (!location.state || !gameId)
		history.replace({
			pathname: "/",
		});

	return (
		<div
			className="flex flex-col items-center px-4"
			style={{
				height: window.innerHeight,
			}}
		>
			<Link to="/" className="underline text-gray-500">
				Go Home
			</Link>

			<p className="self-end md:text-lg">Joined: {online}</p>

			<div className="flex-grow-1 h-full justify-center flex flex-col">
				<div className="board">
					{board.map((value: any, index: number) => {
						return cell(value, index);
					})}
				</div>
				<p>
					Playing as : <b>{playingAs}</b>
				</p>
			</div>

			<a
				target="_blank"
				href={window.location.origin + "/join/" + gameId}
				className="my-4 text-gray-500 text-sm md:text-base"
				rel="noreferrer"
			>
				Game: {gameId}
			</a>
		</div>
	);
};

export default Game;
