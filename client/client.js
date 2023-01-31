const { Socket } = require("net");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const END = "END";

const error = (message) => {
  console.error(message);
  process.exit(1);
};

const connect = (host, port) => {
  console.log(`Conectando a ${host}:${port}`);

  const socket = new Socket();
  socket.connect({ host, port });
  socket.setEncoding("utf-8");

  socket.on("connect", () => {
    console.log("Conectado");

    readline.question("Ingresa tu nombre: ", (username) => {
      socket.write(username);
      console.log(`Escribe cualquier mensaje para enviarlo, escribe ${END} para desconectarte`);
    });

    readline.on("line", (message) => {
      socket.write(message);
      if (message === END) {
        socket.end();
      }
    });

    socket.on("data", (data) => {
      console.log(data);
    });
  });

  socket.on("error", (err) => error(err.message));

  socket.on("close", () => {
    console.log("Desconectado");
    process.exit(0);
  });
};

connect("127.0.0.1" ,3000);