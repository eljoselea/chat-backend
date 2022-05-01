const {io} = require('../index');


//Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.on('disconnect', () => { 
        console.log ('Cliente desconectado')
    });
    
    //client.on('emitir-mensaje', (payload) => {
        //console.log(payload);
        //io.emit('nuevo-mensaje', payload); // emite a todos
        // emitir a todos menos al cliente que lo emitió
        //client.broadcast.emit('nuevo-mensaje', payload);
    //})

});