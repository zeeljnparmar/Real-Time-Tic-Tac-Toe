import React, { useEffect, useRef, useState } from "react";
import "../Bootstarp.css";
import "./Game.css";
import { useHistory, useParams } from "react-router-dom";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

const style = {
  height: "60px",
  width: "60px",
  fontSize: "20px",
};

var socket;
const Game = () => {
  const { username, roomId, userId } = useParams();
  const turn = useRef(0);
  const [players, setPlayers] = useState({});
  const [pos, setPos] = useState(Array(9).fill(null));
  const [col, setCol] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const history = useHistory();
  const turnIndicatorRef = useRef(null);

  const updateTurnIndicator = () => {
    const playerIds = Object.keys(players);
    if (playerIds.length === 2) {
      const currentPlayerId = playerIds[turn.current % 2];
      const currentPlayerName = players[currentPlayerId];
      if (turnIndicatorRef.current) {
        turnIndicatorRef.current.innerText = `Turn: ${currentPlayerName}`;
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("join-room", {
      user: username,
      roomId: roomId.toString(),
      userId: userId,
    });

    socket.on("setPlayer", async (p) => {
      await setPlayers(() => p);
      updateTurnIndicator();
    });

    socket.once("playerLeft", (data) => {
      alert(data.err);
      history.push(`/room/${username}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [username, roomId, userId]);

  useEffect(() => {
    socket.on("move-made", (data) => {
      turn.current = data.turn;
      let p = data.pos;
      let postions = [...pos];
      if ((data.turn - 1) % 2 === 0) {
        postions[p] = 48;
      } else {
        postions[p] = 10799;
      }
      setPos(postions);
      setCol((oldCol) => [...oldCol, 1]);
      updateTurnIndicator();
    });

    socket.on("gameFinished", (data) => {
      let message = "";
      if (data.winner === -1) {
        message = "It's a draw!";
      } else if (data.winner === 48) {
        message = "Player 1 wins!";
      } else if (data.winner === 10799) {
        message = "Player 2 wins!";
      }
    
      // Asking user if they want to restart or leave the game
      const choice = window.confirm(`${message}`);
    
      if (choice) {
        history.push(`/room/${username}`);
      } else {
        // If they chose to leave, redirect them back to the room
        history.push(`/room/${username}`);
      }
    });
    
    
    socket.on("gameReset", (data) => {
      setPos(data.pos);
      turn.current = data.turn;
      updateTurnIndicator();
    });

    return () => {
      socket.off("gameReset");
    };
  }, [pos, history]);

  const btnClick = async (e) => {
    console.log(players)
    if (!e.target.readOnly) {
      if (Object.keys(players)[turn.current % 2] === userId) {
        let posArr = [...pos];
        posArr[parseInt(e.target.name)] =
          turn.current % 2 === 0 ? 48 : 10799;
        turn.current += 1;
        socket.emit("make-move", {
          turn: turn.current,
          roomId: roomId,
          pos: e.target.name,
          posArr: posArr,
        });
      } else {
        alert("Another player's turn.");
      }
    } else {
      alert("Already played.");
    }
  };

  const resetGame = () => {
    setPos(Array(9).fill(null));
    setCol([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    turn.current = 0;
    socket.emit("reset-game", { roomId: roomId });
  };

  return (
    <>
      {Object.keys(players).length === 2 ? (
        <div className="container-fuild">
          <div className="mt-5">
            <center>
              <h2>Tic Tac Toe</h2>
            </center>
          </div>

          <div className="details-container">
            <p>Room ID : {roomId}</p>
            {Object.keys(players).map((val, i) => (
              <SetPlayerName key={i} index={i} val={val} players={players} />
            ))}
          </div>

          <center>
            <div className="controls">              
              <button className="restart-btn" onClick={resetGame}>
                Restart Game
              </button>
            </div>

            <div className="game-container">
              {col.map((p, index) => (
                <Box
                  key={index}
                  pos={index}
                  sign={pos[index]}
                  btnclk={btnClick}
                />
              ))}
            </div>
          </center>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

const SetPlayerName = (props) => {
  return (
    <p>
      Player {props.index + 1} : {props.players[props.val]}
      <span style={{ marginLeft: "2%" }}>
        Sign: {props.index === 0 ? String.fromCharCode(48) : String.fromCharCode(10799)}
      </span>
    </p>
  );
};

const Loader = () => (
  <center>
    <h2>Please wait for another player...</h2>
  </center>
);

const Box = (props) => {
  if (props.pos <= 8) {
    return (
      <input
        type="button"
        value={props.sign ? String.fromCharCode(props.sign) : ""}
        name={props.pos}
        className="box"
        style={style}
        onClick={(e) => props.btnclk(e)}
        readOnly={props.sign ? true : false}
      />
    );
  } else {
    return null;
  }
};

export default Game;
