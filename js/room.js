var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var perspective = {x:0,z:500,theta:0};

var points = [
    make_3_point(50, 50, 1000),
    make_3_point(50, -50, 1000),
    make_3_point(-50, 50, 1000),
    make_3_point(-50, -50, 1000),
    make_3_point(100, -50, 900),//4
    make_3_point(-100, -50, 900),
    make_3_point(100, 50, 900),
    make_3_point(-100, 50, 900),
    make_3_point(100, 50, 700),//8
    make_3_point(-100, 50, 700),
    make_3_point(100, -50, 700),
    make_3_point(-100, -50, 700),
];

//var faces = [[0,1,2,3]];
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

var triangles = [
    [0,3,1,colors[8]],[0,2,3,colors[8]],
    [4,6,0,colors[5]],[0,1,4,colors[5]],
    [7, 5, 2,colors[5]],[3,2,5,colors[5]],
    [2,0,6,colors[4]],[7,2,6,colors[4]],
    [1,3,4,colors[4]],[4,3,5,colors[4]],

    [10,4,11,colors[6]],[5,11,4,colors[6]],
    [6,8,9,colors[6]],[9,7,6,colors[6]],

    [10,6,4,colors[7]],[6,10,8,colors[7]],
    [9,5,7,colors[7]],[5,9,11,colors[7]],
    
    [3,0,1,colors[1]],[2,0,3,colors[1]],
    [4,0,6,colors[1]],[1,0,4,colors[1]],
    [7,2,5,colors[1]],[3,5,2,colors[1]],
    [2,6,0,colors[1]],[7,6,2,colors[1]],
    [1,4,3,colors[1]],[4,5,3,colors[1]],

    [6,10,4,colors[1]],[10,6,8,colors[1]],
    [5,9,7,colors[1]],[9,5,11,colors[1]],

                ];
//                 [0,2]];

//draw_triangles(points, triangles);

var fps = 20;
function cron(){
    draw_helper(points, triangles);
    setTimeout(cron, 1000/fps);
};
cron();

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
function draw_helper(points, triangles) {
    var r = rotation_matrix_y(perspective.theta);
    //console.log(JSON.stringify(r));
    var points2 = points.map(
        function(p) {
            return(in_perspective(p, r)) });
    ctx.clearRect(0, 0, c.width, c.height);
    return draw_triangles(points2, triangles);
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
function draw_triangles(corners, triangles) {
    if (triangles.length == 0) {
        return(0);
    }
    var tri = triangles[0];
    var P0 = corners[tri[0]];
    var P1 = corners[tri[1]];
    var P2 = corners[tri[2]];
    if ((P0.z > 10) && (P1.z > 10) && (P2.z > 10)) {
        var p1 = three_to_two(P0);
        var p2 = three_to_two(P1);
        var p3 = three_to_two(P2);
        draw_triangle(p1, p2, p3, tri[3]);
    }
    return draw_triangles(corners, triangles.slice(1));
};

function three_to_two(a) {
    //takes a 2d images of the 3d model
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
    





/*
function old(){
    var r = identity();
r = mul_m_m(r, rotate_matrix_3(100,0,0));

//console.log(JSON.stringify(r));
var dr = [0,0,0];
var W = c.width;
var Z = W;
var size = 200;
var corners = [
    make_3_point(size, size, Z+size),
    make_3_point(size, size, Z-size),
    make_3_point(size, -size, Z+size),
    make_3_point(size, -size, Z-size),
    make_3_point(-size, size, Z+size),
    make_3_point(-size, size, Z-size),
    make_3_point(-size, -size, Z+size),
    make_3_point(-size, -size, Z-size),
    make_3_point(size+5, 20, Z),//8
    make_3_point(size+5, 0, Z + 20),
    make_3_point(size+5, -20, Z),
    make_3_point(size+5, 0, Z - 20),
    make_3_point(size+5, 35, Z),
    make_3_point(size+5, 0, Z + 35),
    make_3_point(size+5, -35, Z),
    make_3_point(size+5, 0, Z - 35),//15
    //make_3_point(0,0,Z+size),
    make_3_point(0,0,Z),
    make_3_point(0,0,Z+size+size),//17
];
var colors = [
    "#880000",
    "#888800",
    "#008800",
    "#008888",
    "#880088",
    "#000088"
];
var purple = "#880088";
var blue = "#000088";
var black = "#000000";
var faces = [[3,2,0,1],[4,6,7,5],[0,4,5,1],[2,3,7,6]];//,[4,0,2,6]];//,[3,1,5,7]];
var triangles =
    ([[3,1,16,blue],[1,5,16,black],[5,7,16,blue],[7,3,16,black]]).concat(
        [[4,0,17,purple],[0,2,17,black],[2,6,17,purple],[6,4,17,black]]).concat(
        faces_to_triangles(faces,colors)).concat(
            [[13,12,14,"#FFFFFF"],[12,15,14,"#FFFFFF"]]).concat(
                [[9,8,10,"#000000"],[8,11,10,"#000000"]]);
draw_helper();
function faces_to_triangles(L,C) {
    if (L.length == 0) {
        return([]);
    }
    var h = L[0];
    return [[h[0],h[1],h[2],C[0]],
            [h[0],h[2],h[3],C[0]],
            [h[0],h[1],h[3],C[0]],
            [h[1],h[2],h[3],C[0]]
           ].concat(
        faces_to_triangles(L.slice(1),
                           C.slice(1)));
};
function make_3_point(a, b, c) {
    return {x: a, y: b, z: c};
}
function rotate3(point, rotation) {
    var W = c.width;
    var x = point.x;
    var y = point.y;
    var z = point.z - W;
    var V = mul_v_m([x, y, z],rotation);
    var X = V[0];
    var Y = V[1];
    var Z = V[2];
    return make_3_point(X, Y, Z+W);
};
function draw_helper() {
    var corners2 = corners.map(function(x) {return(rotate3(x, r))});
    ctx.clearRect(0, 0, c.width, c.height);
    draw_triangles(corners2, triangles);
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
    console.log(p1.z);
    var za = (p1.z + p2.z + p3.z)/3;
    if (b && (za > 10)) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.fillStyle = color;
        ctx.fill();
    }
}
function three_to_two(a) {
    var W = c.width;
    var Z = W;
    var H = c.height;
    var f = a.z / Z;//default distance is 100 units in front of you.
    var X = (W/2) + (a.x / f);
    var Y = (H/2) + (a.y / f);
    return {x: X, y: Y};
}
function draw_triangles(corners, triangles) {
    if (triangles.length == 0) {
        return(0);
    }
    var tri = triangles[0];
    var p1 = three_to_two(corners[tri[0]]);
    var p2 = three_to_two(corners[tri[1]]);
    var p3 = three_to_two(corners[tri[2]]);
    draw_triangle(p1, p2, p3, tri[3]);
    return draw_triangles(corners, triangles.slice(1));
};
function identity() {
    return([[1,0,0],
            [0,1,0],
            [0,0,1]]);
};
function rotate_matrix_3(a1,a2,a3) {
    var m1 = rotation_matrix_x(a1);
    var m2 = rotation_matrix_y(a2);
    var m3 = rotation_matrix_z(a3);
    var m4 = mul_m_m(m1, m2);
    return(mul_m_m(m4, m3));
};
function rotation_matrix_x(angle) {
    return([[1,0,0],
            [0,Math.cos(angle),-Math.sin(angle)],
            [0,Math.sin(angle),Math.cos(angle)]]);
};
function rotation_matrix_y(angle) {
    return([
        [Math.cos(angle),0,Math.sin(angle)],
        [0,1,0],
        [-Math.sin(angle),0,Math.cos(angle)]]);
};
function rotation_matrix_z(angle) {
    return([
        [Math.cos(angle),-Math.sin(angle),0],
        [Math.sin(angle),Math.cos(angle),0],
        [0,0,1]]);
};
function mul_v_v(v1, v2) {
    if (JSON.stringify(v1) == JSON.stringify([])) {
        return(0);
    };
    return (v1[0]*v2[0]) + mul_v_v(v1.slice(1),v2.slice(1));
};
function mul_v_m(v, m){
    return([mul_v_v(v, m[0]),
            mul_v_v(v, m[1]),
            mul_v_v(v, m[2])])
};
function column(m, n) {
    if (n < 0) { return(0); }
    if (n == 0) { return(m.map(function(x){return(x[0]);}))}
    return column(m.map(function(x){return(x.slice(1))}),
                  n-1);
};
function mul_m_m(m1, m2) {
    var cs = [0,1,2].map(function(x){return(column(m2, x))});
    return([0,1,2].map(function(n){return(
        cs.map(function(x){return(
            mul_v_v(m1[n], x))}))}));
};
function v_sum(a, b) {
    if(a.length == 0) {
        return([]);
    };
    return [a[0]+b[0]].concat(v_sum(a.slice(1),b.slice(1)));
};
function mul_v_s(V, S) {
    if(V.length == 0) {
        return([]);
    };
    return [V[0]*S].concat(mul_v_s(V.slice(1), S));
};
document.addEventListener('click', function(e){
    //give the cube a little kick depending on which part we click on.
    var L = c.offsetLeft;
    var T = c.offsetTop;
    var W = c.width;
    var H = c.height;
    var mouseX = e.pageX;
    var mouseY = e.pageY;
    var Y = mouseX - L - (W/2);
    var X = mouseY - T - (H/2);
    var kick = [X, Y, 0];
    kick = mul_v_s(kick, 1/W/10);
    dr = v_sum(dr, kick);
})

cron();
function cron() {
    setTimeout(function(){
        dr = [dr[0] * 0.99, dr[1] * 0.99, dr[2] * 0.99];//reduce spinning with friction.
        var r2 = rotate_matrix_3(dr[0], dr[1], dr[2]);//a rotation matrix based on how fast we are spinning
        r = mul_m_m(r, r2);//use the rotation matrix to calculate our new position
        draw_helper();//draw the cube in it's current position
        return cron();
    }, 20);//attempting 50 frames per second.
};
};
*/
