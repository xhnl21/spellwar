import { io } from 'socket.io-client';
export default class clientSocketIO {
    static socketGame;
    static socketChat;
    static url = 'http://192.168.31.79';
    static portGame = 3000;
    static portChat = 4000;
    static userId = clientSocketIO.generateUserID(1, 999999999);
    static socketId;

    static generateUserID(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    connectionGame() {
        return new Promise((resolve, reject) => {
            clientSocketIO.socketGame = io(clientSocketIO.url + ':' + clientSocketIO.portGame);
              
            let socketId = clientSocketIO.socketGame.id;
            let o = {userId: clientSocketIO.userId, socketId: socketId};           
            this.sendEvent('createConnection', o);
            clientSocketIO.socketGame.on('createConnectionClient', (data) => {
                if (!data.status) {
                    clientSocketIO.socketGame.disconnect();
                    this.msj(false, 2, data);
                    reject(false);
                } else {
                    this.msj(true, 1, data);
                    clientSocketIO.socketId = data.socketId;
                    resolve(clientSocketIO.socketGame.id);
                }
            });

            clientSocketIO.socketGame.on('disconnect', () => {
                console.log('Socket disconnected');
                clientSocketIO.socketGame.disconnect();
            });
        });
    }
    getSocketId() {
        return clientSocketIO.socketId;
    }
    connectionChat() {
        clientSocketIO.socketChat = io(clientSocketIO.url + ':' + clientSocketIO.portChat);

        let socketId = clientSocketIO.socketChat.id;
        let o = {userId: clientSocketIO.userId, socketId: socketId};
        this.sendEvent('createConnection', o);
        clientSocketIO.socketChat.on('createConnectionClient', (data) => {
            if (!data.status) {
                clientSocketIO.socketChat.disconnect();
                this.msj(false, 2, data);
            } else {
                this.msj(true, 1, data);
            }
        });

        clientSocketIO.socketChat.on('connect', () => {
            console.log('Socket connected:', clientSocketIO.socket.id);
        });

        clientSocketIO.socketChat.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    }
    getEvent(funt){
        return new Promise((resolve) => {
            clientSocketIO.socketGame.off(funt);
            clientSocketIO.socketGame.on(funt, (msg) => {
                let socketId = clientSocketIO.socketId;
                if (msg.socketId != socketId){
                    msg.act[0].socketId = msg.socketId;
                    resolve(msg.act[0]);  // Resolver la Promesa con el mensaje
                }            
            });
        }); 
    }

    sendEvent(funt, act){        
        let socketId = clientSocketIO.socketId;
        clientSocketIO.socketGame.emit(funt, {act, socketId});
    }

    msj(bool, type, data) {
        let stype = 'void:'
        if (type === 1) {
          stype = 'succes:';
        } if (type === 2) {
          stype = 'error:';
        } if (type === 3) {
          stype = 'msj:';
        }
        if (bool) {
          console.log(stype, data);
        } else {
          console.error(stype, data);
        }
    }
}