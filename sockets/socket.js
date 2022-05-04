const { comprobarJWT } = require('../helpers/jwt');
const {io} = require('../index');
const {usuarioConectado, usuarioDesconectado, grabarMensaje} = require ('../controllers/socket')

//Mensajes de sockets
io.on('connection', (client) => {
    console.log('Cliente conectado');
    //console.log(client.handshake.headers);

    //?? cliente con jwt?
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token'])

    //console.log(valido, uid);

    // Verificar autenticación
    if (!valido) {return client.disconnect();}
    
    // Cliente autenticado
        usuarioConectado(uid);

    // Ingresar al usuario a una sala en particular
    //sala global, client.id    626fedb6ac68b19dfc6b79b2
    client.join(uid);

    //Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async (payload) => {
    //Grabar mensaje
    await grabarMensaje(payload);


        //console.log(payload);
        io.to(payload.para).emit('mensaje-personal', payload);
    })



    client.on('disconnect', () => { 
        //console.log ('Cliente desconectado')
        usuarioDesconectado(uid);
    });
    
    //client.on('emitir-mensaje', (payload) => {
        //console.log(payload);
        //io.emit('nuevo-mensaje', payload); // emite a todos
        // emitir a todos menos al cliente que lo emitió
        //client.broadcast.emit('nuevo-mensaje', payload);
    //})

});