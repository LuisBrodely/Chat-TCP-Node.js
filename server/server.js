const net = require("net");
const { send } = require("process");

const server = net.createServer();
const serverPort = 3000;

const connections = new Map();

const sendMessage = (message, origin) => {
  for (const socket of connections.keys()) {
    if (socket !== origin) {
      socket.write(message);
    }
  }
};

server.listen(serverPort, () => {
  console.log("Servidor escuchando en el puerto: ", server.address().port);

  server.on("connection", (socket) => {
    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
    socket.setEncoding('utf-8')
    
  
    socket.on("data", (data) => {
      if ( !connections.has(socket)) {
        let isRegistered =false;
        connections.forEach((nickname) => {
          if (nickname == data) {
            socket.write('El nombre ingresado no esta disponible. Por favor, ingresa otro nombre: ');
            isRegistered=true;
          }
        });

        if(!isRegistered) {
          connections.set(socket, data);
        console.log(remoteSocket, " Conectado con el nombre ", data);
        socket.write('Conectado');
        }
  
      }else {
        console.log(`[${connections.get(socket)}]: ${data}`);
  
          const fullMessage = `[${connections.get(socket)}]: ${data}`;
          console.log(`${remoteSocket} -> ${fullMessage}`);
          sendMessage(fullMessage, socket);
        
      }
      
    });
  
    socket.on("error", (err) => {
      console.error(err.message);
      process.exit(1);
    });
  
    socket.on("close", () => {
      console.log("Comunicación terminada con ", connections.get(socket));
      connections.delete(socket);
    });
  });
  
});
