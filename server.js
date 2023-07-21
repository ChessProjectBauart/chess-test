import { Server } from "socket.io";
import { Chess } from "chess.js";

const io = new Server(3000, {
  cors: {
    origin: "http://localhost:5173",
  },
});

console.log("Server up");

const chess = new Chess();
let flag = [false, false];

io.on("connection", (socket) => {
  if (!flag[0]) {
    socket.data = "w";
    flag[0] = true;
  } else {
    if (!flag[1]) {
      socket.data = "b";
      flag[1] = true;
    } else {
      socket.data = "observer";
    }
  }
  console.log("connection " + socket.data);

  socket.emit("hello from server", chess, socket.data);

  socket.on("get role", (callback) => {
    callback(socket.data);
  });
  socket.on("get board", (callback) => {
    callback(chess);
  });
  // console.log(chess);

  console.log(socket.id);
  socket.on("get position", (payload, callback) => {
    if (socket.data == chess.turn()) {
      // console.log('a1');
      // console.log(chess.moves({ square: payload }));
      callback(chess.moves({ square: payload }));
      // socket.emit("legal moves", chess.moves({ square: payload }));
      // ...
    }
  });
  console.log(chess.turn());

  // ЗДЕСЬ ходы чекаются
  socket.on("compare", (...payload) => {
    if (socket.data == chess.turn()) {
      console.log("comapre", payload);
      const legalmoves = chess.moves({ square: payload[0] });
      const nextposition = payload[1];

      console.log("legalmoves");
      console.log(legalmoves);

      // console.log("FROM - payload[0]");
      // console.log(payload[0]);
      // console.log("TO - payload[1]");
      // console.log(payload[1]);

      // СТАРТ
      console.log("start move");
      const moveData = {
        from: payload[0],
        to: nextposition,
      };

      console.log("moveData");
      console.log(moveData);

      try {
        chess.move(moveData);
        socket.emit("accept move", true, chess.turn(), chess.fen());
        socket.broadcast.emit("accept move", true, chess.turn(), chess.fen());

        if (chess.isGameOver()) {
          if (chess.isCheckmate()) {
            socket.emit("game over", socket.data);
            socket.broadcast.emit("game over", socket.data);
          }
        }
      } catch (e) {
        console.log("false");
        console.log("error");
        console.log(e);
        console.log("chess.turn()");
        console.log(chess.turn());
        console.log("chess.fen()");
        console.log(chess.fen());

        socket.emit("accept move", false, chess.turn(), chess.fen());
        socket.broadcast.emit("accept move", false, chess.turn(), chess.fen());
      }
      // КОНЕЦ

      // ----------------------------------------
      // if (true) {
      //   console.log("true");
      //   chess.move({
      //     from: payload[0],
      //     to: nextposition,
      //   });
      //   socket.emit("accept move", true, chess.turn(), chess.fen());
      //   socket.broadcast.emit("accept move", true, chess.turn(), chess.fen());
      // } else {
      //   console.log("false");
      //   socket.emit("accept move", false, chess.turn(), chess.fen());
      //   socket.broadcast.emit("accept move", false, chess.turn(), chess.fen());
      // }

      // if (chess.isGameOver()) {
      //   socket.broadcast.emit("game over");
      //   socket.emit("game over");
      // }
      // ----------------------------------------

      console.log(chess.ascii());
    }
  });

  // io.emit("hello from server", "ddsjvvsdjvdsjbds")

  socket.on("reset board", () => {
    if (socket.data == "w" || socket.data == "b") {
      chess.reset();
      socket.emit("answer reset", chess.fen());
      socket.broadcast.emit("answer reset", chess.fen());
    }
  });

  socket.on("disconnect", () => {
    if (socket.data == "w") {
      console.log("disconnect w");
      flag[0] = false;
    } else {
      if (socket.data == "b") {
        console.log("disconnect b");
        flag[1] = false;
      } else {
        console.log("disconnect observer");
      }
    }
  });
});
