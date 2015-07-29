/* 
 * Wraps peerjs with a pubsub api
 */

var server_options = {
    host: 'localhost',
    port: 9000,
    config: {
        iceServers: [
            {url: 'stun:stun.l.google.com:19302'},
        ]
    }
}
var me = new Peer(server_options);
var nocturnal = {
    me: me,
    subscribe: function(channel, callback) {
        var conn = me.connect(channel);
        conn.on('data', function(data) {
            callback(data);
        });
    },
    create: function(channel) {
        var peer = new Peer(channel, server_options);
        peer.on('error', function(error) {
            console.error(error);
        });
        peer.on('connection', function(conn) {
            console.log(conn.id, 'connected to your channel', channel);
        })
        return {
            peer: peer, // for debug. TODO remove
            send: function(data) {
                Object.keys(peer.connections).forEach(function(key) {
                    var conn = peer.connections[key][0];
                    conn.send(data);
                });
            }
        }
    }
};
