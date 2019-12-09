

class ChatSocket {
    constructor(io, apiFunctions) {
        this.io = io;
        this.apiFunctions = apiFunctions;
        this.init = this.init.bind(this);
    }

    init(){
        this.io.on('connection', (socket) => {
            console.log('A user connected');


            socket.on('chat', async (data) => {
                const key = data.chatId;
                const creds = await this.apiFunctions.credentialsById(data.userId);
                socket.username = creds.username;

                socket.join(key)

                console.log("chat requested connection, ", data.userId, socket.id, " CHAT ID IS ", key);

            });

            socket.on('join-chat', (data) => {
                
            });

            socket.on('disconnect', () => {
                console.log("DUDE DISCONNECTED")
            })

            socket.on('user-left', (data) => {
                const key = data.chatId
                socket.leave(key)
            })

            socket.on('msg', (data) =>  {
                if(!data.text) {
                    return; 
                }
                const key = data.chatId;

                var clients = this.io.of('/').in(key).clients((error, clients) => {

                    if(clients.length < 2) {
                        return socket.emit('offline-peer');
                    }
                    
                    for(const fs of clients) {
                        if(fs != socket.id) {
                            this.io.to(`${fs}`).emit('message-received', {username: socket.username, text: data.text});
                        }
                    }

                });
            })

        });
    }
}

module.exports = ChatSocket;