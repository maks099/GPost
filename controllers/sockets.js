

module.exports = io => {


    io.on('connection', (socket) => {
        socket.on('sending_status_changed', (msg) => {
            io.emit('sending_status_changed', msg);
        });


        socket.on('added_sending', (msg) => {
            io.emit('added_sending', msg);
        });


        socket.on('send_give_code', (msg) => {
            console.log('hello')
            io.emit('send_give_code', msg);
        });
    });
}