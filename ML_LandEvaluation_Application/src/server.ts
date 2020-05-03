import app from "./app";
const http = require('http').createServer(app);
export const io = require('socket.io')(http);

/**
 * Start Express server.
 */
const server = http.listen(app.get("port"), () => {
    console.log(
        "  App is running at port //:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});

/**
 * Web Socket Connection
 */
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => { console.log('user disconnected'); });
});
export default server;