var gui = require('..');

window.init = function() {

    var ui = new gui.UI();

}

// var steptoe = require('steptoe');

// window.init = function() {

//     var canvas = $('#canvas')[0];
//     var ctx = canvas.getContext('2d');
//     ctx.lineWidth = 1;

//     $('#run').click(function() {

//         var code = $('#code').val();

//         var vm = new steptoe.Machine();

//         var main = steptoe.parseFunction(code);

//         var env = {
//             clear: function() {
//                 ctx.clearRect(0, 0, canvas.width, canvas.height);
//             },

//             line: function(x1, y1, x2, y2) {
//                 ctx.beginPath();
//                 ctx.moveTo(x1, y1);
//                 ctx.lineTo(x2, y2);
//                 ctx.stroke();
//             },



//             print: function(message) {
//                 console.log(message);
//             }
//         };

//         vm.restart(env, main);
//         while (vm.isRunning()) {
//             vm.step();
//         }

//     });
    
// }