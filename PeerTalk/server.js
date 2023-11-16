const Socket = require("websocket").server;
const http = require("http");

const server = http.createServer((req, res) => {});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const webSocket = new Socket({ httpServer: server });

let users = [];

webSocket.on("request", (req) => {
  const connection = req.accept();

  connection.on("message", (message) => {
    const data = JSON.parse(message.utf8Data);
    const user = findUser(data.username);

    switch (data.type) {
      case "store_user":
        if (user !== undefined) {
          console.log(
            `Username: ${data.username} is already in use for a call.`
          );
          return;
        }

        const newUser = {
          conn: connection,
          username: data.username,
          candidates: [], // Initialize candidates as an empty array for new users
        };

        users.push(newUser);
        console.log(`Username: ${newUser.username} created a call request`);
        break;

      case "store_offer":
        if (user == null) return;
        user.offer = data.offer;
        break;

      case "store_candidate":
        if (user == null) return;
        if (!user.candidates) user.candidates = [];
        user.candidates.push(data.candidate);
        break;

      case "send_answer":
        if (user == null) return;
        sendData(
          {
            type: "answer",
            answer: data.answer,
          },
          user.conn
        );
        break;

      case "send_candidate":
        if (user == null) return;
        sendData(
          {
            type: "candidate",
            candidate: data.candidate,
          },
          user.conn
        );
        break;

      case "join_call":
        if (user == null) return;
        sendData(
          {
            type: "offer",
            offer: user.offer,
          },
          connection
        );

        user.candidates.forEach((candidate) => {
          sendData(
            {
              type: "candidate",
              candidate: candidate,
            },
            connection
          );
        });
        break;
    }
  });

  connection.on("close", (reason, description) => {
    const index = users.findIndex((user) => user.conn === connection);
    if (index !== -1) {
      const disconnectedUser = users[index];
      users.splice(index, 1);
      console.log(`User ${disconnectedUser.username} disconnected.`);
    }
  });
});

function sendData(data, conn) {
  conn.send(JSON.stringify(data));
}

function findUser(username) {
  return users.find((user) => user.username === username);
}
