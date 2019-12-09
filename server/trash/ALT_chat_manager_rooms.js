
function hexToDec(s) {
    var i, j, digits = [0], carry;
    for (i = 0; i < s.length; i += 1) {
        carry = parseInt(s.charAt(i), 16);
        for (j = 0; j < digits.length; j += 1) {
            digits[j] = digits[j] * 16 + carry;
            carry = digits[j] / 10 | 0;
            digits[j] %= 10;
        }
        while (carry > 0) {
            digits.push(carry % 10);
            carry = carry / 10 | 0;
        }
    }
    return digits.reverse().join('');
}

function hash(a, b) {
    return (parseInt(hexToDec(a)) + parseInt(hexToDec(b))).toString(16);
}


// https://stackoverflow.com/questions/4647348/send-message-to-specific-client-with-socket-io-and-node-js
class ChatManager {
    
    constructor(io, api_functions){
        this.io = io;
        this.init = this.init.bind(this);
        this.apiFunctions = api_functions;
    }

    init(){
        this.io.on('connection', (socket) => {
            console.log('A user connected');


            socket.on('chat', async (data) => {
                const key = data.chatId;
                
                if(!socket.username) {
                    const creds = await this.apiFunctions.credentialsById(data.userId);
                    socket.username = creds.username;
                }

                socket.join(key)

                // if(!this.people[key]) {
                //     this.people[key] = { [data.userId]: socket.id }
                // } else {
                //     this.people[key][data.userId] = socket.id;
                // }

                console.log("chat requested connection, ", data.userId, socket.id)
              //  io.sockets.adapter.rooms['lobby'].sockets
             //   socket.join(`${data.userId}:${data.friendId}`);

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
                    return;//return socket.emit('error');   
                }
                const key = data.chatId;
                //if(!this.people[key][data.friendId]){
                //}
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


                // if(!clients) {
                //     return socket.emit('error');
                // }

                //const clients = this.io.sockets.adapter.rooms[key].sockets
            })

        });
    }
}
module.exports = {ChatManager}