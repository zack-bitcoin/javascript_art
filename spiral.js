
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var img = document.getElementById("pic");
draw_helper();

function draw_helper(X, Y) {
    X = X / 50;
    X = Math.min(20, X);
    X = Math.max(0, X);
    Y = Y / 40;
    Y = Math.min(20, Y);
    Y = Math.max(0, Y);
    ctx.clearRect(0, 0, c.width, c.height);
    //ctx.drawImage(img, 10, 10, 1000, 800);
    ctx.drawImage(img, X-(Y), Y+(X*1.5), 1000, 800);
    ctx.rotate(Math.PI/100);
    ctx.drawImage(img, 0, 0, 1020, 820);
    ctx.rotate(-Math.PI/100);
}; 

document.addEventListener('mousemove', function(e){
    var L = c.offsetLeft;
    var T = c.offsetTop;

    var mouseX = e.pageX;
    var mouseY = e.pageY;
    draw_helper(mouseX - L, mouseY - T);
    //console.log(JSON.stringify(mouseX - L));
    //console.log(JSON.stringify(mouseY - T));
    //console.log(JSON.stringify(e));
})
