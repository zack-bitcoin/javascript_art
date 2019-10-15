var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var perspective = {x:0,z:500,theta:0};

var fps = 20;
var colors = ["#880000",//red
              "#000000",//black
              "#008800",//green
              "#000088",//blue
              "#FF0088",//pink
              "#88FF00",//lime
              "#FF8800",//neon orange
              "#00FF88",//green3
              "#FF0000",//bright red
             ];
var pdb = pdb_maker();
var triangles =
    grove(pdb, pine, -400, 800, 10, 10, 600, 800, 0, 2, 30).concat(
        grove(pdb, coral, -400, 800, 10, 10, 600, 800, 0.3, 0.2, 100)).concat(
            grove(pdb, kelp, -400, 800, 10, 10, 600, 800, 0.1, 0.1, 50)).concat(
                grove(pdb, daisy, -400, 800, 20, 0, 600, 800, 1, 0.1, 100)).concat(
                    grove(pdb, redwood, -400, 800, -40, 10, 600, 800, 5, 0, 2));

cron();
function cron(){
    var pdb2 = pdb.perspective();
    draw_helper(pdb2, triangles);
    setTimeout(cron, 1000/fps);
};

function pdb_maker() {
    var db = {type: "points"};
    var top = 0;
    var x = {
        top: top,
        db: db,
        add: function(x,y,z) {
            db[top] = make_3_point(x, y, z);
            top += 1;
            return(top-1);
        },
        perspective: function(){
            //rotates and shifts each point over based on your current location and the direction you are facing. Points are still specified in 3d.
            var r = rotation_matrix_y(perspective.theta);
            var db2 = {};
            for(i=0;i<top;i++) {
                db2[i] = in_perspective(db[i], r);
            };
            return(db2);
        }
    };
    return(x);
};



function make_plant(db, x, y, z, stem_length, stem_width, many, f, color) {
    if(many < 1) {
        return([]);
    }
    var tip = db.add(x,y+stem_length,z);
    var base = [
        db.add(x+stem_width,y,z),
        db.add(x-stem_width,y,z),
        db.add(x,y, stem_width+z),
        db.add(x,y, -stem_width+z),
    ];
    //var color = colors[2];
    var tris = [
        [tip, base[0], base[1], color],
        [tip, base[1], base[0], color],
        [tip, base[2], base[3], color],
        [tip, base[3], base[2], color],
    ];
    return(tris.concat(make_plant(db, x, y-(f*f*stem_length), z, f*stem_length, f*stem_width, many-1, f, color)));
};
function pine(db, x, y, z, size) {
    return(make_plant(db, x, y, z, size*10, size*20, 15, 7/8, colors[2]));
};
function coral(db, x, y, z, size) {
    return(make_plant(db, x, y, z, size*20, size*5, 4, 4/5, colors[4]));
};
function kelp(db, x, y, z, size) {
    return(make_plant(db, x, y, z, size*20, size*20, 20, 1, colors[5]));
};
function redwood(db, x, y, z, size) {
    return(make_plant(db, x, y, z, size*15, size*20, 20, 4/5, colors[0]));
};
function daisy(db, x, y, z, size) {
    return(make_plant(db, x, y, z, size/3, size*1, 3, 1.7, colors[3]));
};
function grove(db, tree, x, x2, y, y2, z, z2, size, size2, many) {
    var X = [];
    for(i=0;i<many;i++){
        var p = tree(db,
                     x + (x2 * Math.random()),
                     y + (y2 * Math.random()),
                     z + (z2 * Math.random()),
                     size + (size2 * Math.random()));
        X = X.concat(p);
    };
    return(X);
};


function in_perspective(point, rotation) {
    var point2 = make_3_point(point.x - perspective.x, point.y, point.z - perspective.z);
    var point3 = mul_v_m(point2, rotation);
    return(point3);
};
function mul_v_v(p, v) {
    return (p.x*v[0]) + (p.y * v[1]) + (p.z * v[2]);
};
function mul_v_m(p, m){
    var p2 = JSON.parse(JSON.stringify(p));
    p2.x = mul_v_v(p, m[0]);
    p2.y = mul_v_v(p, m[1]);
    p2.z = mul_v_v(p, m[2]);
    return(p2);
};

function rotation_matrix_y(angle) {
    return([
        [Math.cos(angle),0,Math.sin(angle)],
        [0,1,0],
        [-Math.sin(angle),0,Math.cos(angle)]]);
};

function make_3_point(a, b, c) {
    return {x: a, y: b, z: c};
}
function clockwise(p1, p2, p3) {
    //checking the sign of the cross product of a couple vectors made from these points.
    var v1 = [(p2.x - p1.x), (p2.y - p1.y)];
    var v2 = [(p3.x - p1.x), (p3.y - p1.y)];
    var cross = (v1[0]*v2[1]) - (v2[0]*v1[1]);
    return cross > 0;
};
function draw_triangle(p1, p2, p3, color) {
    var b = clockwise(p1, p2, p3);
    if (b) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.fillStyle = color;
        ctx.fill();
    }
}
function draw_triangles(corners, Tris) {
    for(i=0;i<Tris.length;i++){
        var tri = Tris[i];
        var P0 = corners[tri[0]];
        var P1 = corners[tri[1]];
        var P2 = corners[tri[2]];
        if ((P0.z > 0) && (P1.z > 0) && (P2.z > 0)) {
            var p1 = three_to_two(P0);
            var p2 = three_to_two(P1);
            var p3 = three_to_two(P2);
            draw_triangle(p1, p2, p3, tri[3]);
        }
    };
};
function perspective_distance(points, triangle) {
    var p0 = points[triangle[0]];
    return(p0.z);
};
function draw_helper(points2, tris) {
    var f = function(x) {return(perspective_distance(points2, x));};
    var triangles2 = tris.sort(function(t1, t2){return(f(t2) - f(t1))});
    ctx.clearRect(0, 0, c.width, c.height);
    return draw_triangles(points2, triangles2);
};
function three_to_two(a) {
    var W = c.width;
    var Z = W;
    var H = c.height;
    var f = a.z / Z;
    var X = (W/2) + (a.x / f);
    var Y = (H/2) + (a.y / f);
    return {x: X, y: Y};
}


//Controller

var step_size = 20;
function left() {
    perspective.theta += 0.1;
};
function step_left() {
    var T = perspective.theta;
    var S = Math.sin(T);
    var C = Math.cos(T);
    perspective.z -= (S*step_size);
    perspective.x -= (C*step_size);
};
function up() {
    var T = perspective.theta;
    var S = Math.sin(T);
    var C = Math.cos(T);
    perspective.z += (C*step_size);
    perspective.x -= (S*step_size);
};
function right() {
    perspective.theta -= 0.1;
};
function step_right() {
    var T = perspective.theta;
    var S = Math.sin(T);
    var C = Math.cos(T);
    perspective.z += (S*step_size);
    perspective.x += (C*step_size);
};
function down() {
    var T = perspective.theta;
    var S = Math.sin(T);
    var C = Math.cos(T);
    perspective.z -= (C*step_size);
    perspective.x += (S*step_size);
};

var keys = {};
keys[37] = left;
keys[38] = up;
keys[39] = right;
keys[40] = down;
keys[65] = step_left;
keys[83] = step_right;
document.addEventListener('keydown', function(event) {
    var f = keys[event.keyCode];
    if(!(f == undefined)){ f(); };
//    console.log(event.keyCode);
});
 
