const N = 20;
const M = 6;
const letters = "BCDEFGH";
bp.registerBThread( "A", function(){
    bp.sync( {waitFor:bp.Event("Start")} );
    for (let i = 0; i < N; i++) {
        bp.hot(true).sync( {request:bp.Event("A")} );
    }
} );
for (let i = 0; i < M; i++) {
    bp.registerBThread(letters[i], function(){
        bp.sync( {waitFor:bp.Event("Start")} );
        for (let j = 0; j < N; j++) {
            bp.sync( {request:bp.Event(letters[i])} );
        }
        while (true){
            bp.sync( {request:bp.Event("I")} );
        }
    } );
}
// bp.registerBThread( "AddB", function(){
//     bp.sync( {waitFor:bp.Event("Start")} );
//     for (let i = 0; i < N; i++) {
//         bp.sync( {request:bp.Event("B")} );
//     }
// } );

bp.registerBThread( "control", function(){
    bp.sync( {request:bp.Event("Start")} );
    while (true){
        bp.sync( {waitFor:bp.Event("A")} );
        bp.sync( {waitFor:bp.all, block: bp.Event("A")} );
    }
} );