(function() {
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
            var eventemitter = document.createElement('dummy');
            conn.on('data', function(data) {
                if(data.type == 'broadcast')
                    callback(data.data);
                if(data.type == 'answer') {
                    answer_callbacks[data.request_number](data.data);
                    delete answer_callbacks[data.request_number];
                }
            });
            conn.on('open', function() {
                eventemitter.dispatchEvent(new Event('open'));
            });
            eventemitter.request = function(data, callback) {
                request_count++;
                answer_callbacks[request_count] = callback;
                conn.send({
                    data: data,
                    type: 'request',
                    request_number: request_count
                });
            };
            eventemitter.close = function() {
                conn.close();
            };
            eventemitter.type = 'client';
            return eventemitter
        },
        create: function(channel, request_callback) {
            var peer = new Peer(channel, server_options);
            var eventemitter = document.createElement('dummy');
            peer.on('error', function(error) {
                // TODO Remind in the readme that it is important to listen to these events as they include important information
                eventemitter.dispatchEvent(new Event('error', error));
            });
            peer.on('connection', function(conn) {
                console.log(conn.id, 'connected to your channel', channel);
                conn.on('data', function(data) {
                    if(request_callback) {
                        var answer_data = request_callback(data.data);
                        conn.send({
                            type: 'answer',
                            request_number: data.request_number,
                            data: answer_data
                        });
                    }
                });
            })
            peer.on('open', function(id) {
                eventemitter.dispatchEvent(new Event('open'));
            });
            eventemitter.type = 'service';
            eventemitter.broadcast = function(data) {
                Object.keys(peer.connections).forEach(function(key) {
                    var conn = peer.connections[key][0];
                    conn.send({
                        type: 'broadcast',
                        data: data
                    });
                });
            };
            eventemitter.close = function() {
                peer.destroy();
            };
            return eventemitter;
        }
    };
    window.nocturnal = nocturnal;
})();
