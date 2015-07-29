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
        var answer_callbacks = {};
        var request_count = 0;
        conn.on('data', function(data) {
            if(data.type == 'broadcast')
                callback(data.data);
            if(data.type == 'answer') {
                console.log(data);
                answer_callbacks[data.request_number](data.data);
                delete answer_callbacks[data.request_number];
            }
        });
        return {
            request: function(data, callback) {
                request_count++;
                answer_callbacks[request_count] = callback;
                conn.send({
                    data: data,
                    type: 'request',
                    request_number: request_count
                });
            },
            close: function() {
                conn.close();
            }
        }
    },
    create: function(channel, request_callback, open_callback) {
        var peer = new Peer(channel, server_options);
        peer.on('error', function(error) {
            console.error(error);
        });
        peer.on('connection', function(conn) {
            console.log(conn.id, 'connected to your channel', channel);
            conn.on('data', function(data) {
                if(request_callback) {
                    var answer_data = request_callback(data.data);
                    console.log('answer data', answer_data);
                    conn.send({
                        type: 'answer',
                        request_number: data.request_number,
                        data: answer_data
                    });
                }
            });
        })
        peer.on('open', function(id) {
            if(open_callback) 
                open_callback(id);
        });
        return {
            broadcast: function(data) {
                Object.keys(peer.connections).forEach(function(key) {
                    var conn = peer.connections[key][0];
                    conn.send({
                        type: 'broadcast',
                        data: data
                    });
                });
            },
            close: function() {
                peer.destroy();
            }
        }
    }
};
