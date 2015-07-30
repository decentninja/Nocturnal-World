describe('pubsub', function() {
    it('can create, subscribe and broadcast', function(done) {
        var sub = nocturnal.subscribe('test', function(data) {
            expect(data).toEqual({a: 3});
            sub.close();
            a.close();
            done();
        });
        var a = nocturnal.create('test', function() {return 'bal'});
        setTimeout(function() {
            a.broadcast({a: 3});
        }, 1000);
    });
    it('answers on requests', function(done) {
        setTimeout(function() {
            var test = nocturnal.subscribe('test', function() {});
            var a = nocturnal.create('test', function(request) {
                expect(request).toEqual('whats up');
                return 'nothing';
            });
            setTimeout(function() {
                test.request('whats up', function(answer) {
                    expect(answer).toEqual('nothing');
                    done();
                });
            }, 100);
        }, 100);
    });
    it('ratelimits requests and broadcasts by closing connections');
});
