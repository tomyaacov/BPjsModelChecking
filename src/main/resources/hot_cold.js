// if (typeof N !== 'undefined') { N = 3 }
// if (typeof M !== 'undefined') { M = 1 }
// if (typeof SOLVED !== 'undefined') { SOLVED = false }
// const N = 3
// const M = 1
// const SOLVED = true

const anyCold = bp.EventSet('anyCold', function (e) {
    return e.name.startsWith('COLD')
})

bp.registerBThread( "adda", function(){
    bp.sync( {waitFor:bp.Event("Start")} );
    for (let i = 0; i < N; i++) {
        bp.hot(true).sync( {request:bp.Event("HOT")} );
    }
} );
for (let i = 0; i < M; i++) {
    bp.registerBThread("addb" + i.toString(), {i:i.toString()}, function(){
        bp.sync( {waitFor:bp.Event("Start")} );
        for (let j = 0; j < N; j++) {
            bp.sync( {request:bp.Event("COLD" + bp.thread.data.i)} );
        }
    } );
}
if (SOLVED){
    bp.registerBThread( "control2", function(){
        bp.sync( {request:bp.Event("Start")} );
        let e = bp.Event("Start");
        while (true){
            if (e.name.startsWith("COLD")){
                e = null;
                e = bp.sync( {waitFor:bp.all, block: anyCold} );
            } else {
                e = null;
                e = bp.sync( {waitFor:bp.all, block: bp.Event("HOT")} );
            }
        }
    } );
} else {
    bp.registerBThread( "control", function(){
        bp.sync( {request:bp.Event("Start")} );
        while (true){
            bp.sync( {waitFor:bp.Event("HOT")} );
            bp.sync( {waitFor:bp.all, block: bp.Event("HOT")} );
        }
    } );
}

