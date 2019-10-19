var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var fps = 60;
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
function minus_3(a, b) {
    return({x: a.x - b.x,
            y: a.y - b.y,
            z: a.z - b.z});
};
function normalize(v) {
    //var d = Math.sqrt((v.x**2) + (v.y**2) + (v.z**2));
    var d = distance_to(v);
    return({x: v.x / d, y: v.y / d, z: v.z / d});
};
function line_maker(location, direction) {
    //location is where you are located.
    // direction is a point in the diretion being observed.
    var d2 = minus_3(direction, location);
    var d = normalize(d2);
    return({loc: location, direction: d});
};
function cube(sidelength, corner) {
    var W = c.width;
    var corner2 = corner;
    return(function(line, db){
        var corner = db[corner2];
        var d = three_to_two(line.direction);
        var c2 = three_to_two(corner);
        var sidelength2 = sidelength * W / corner.z;
        return((d.x < c2.x+sidelength2) &&
               (d.x > c2.x) &&
               (d.y < c2.y + sidelength2) &&
                (d.y > c2.y));
    });
};
function sphere(radius, center) {
    var W = c.width;
    var center2 = center;
    return(function(line, db) {
        var center = db[center2];
        var d = three_to_two(line.direction);
        var c2 = three_to_two(center);
        var r2 = radius * W / center.z;
        return((r2**2) > ((d.x - c2.x)**2 + (d.y - c2.y)**2));
    });
};

function make_3_point(a, b, c) {
    return {x: a, y: b, z: c};
}
function make_2_point(a, b) {
    return {x: a, y: b};
}
function three_to_two(a) {
    var W = c.width;
    var Z = W;
    var H = c.height;
    var f = a.z / Z;
    var X = (W/2) + (a.x / f);
    var Y = (H/2) + (a.y / f);
    return {x: X, y: Y};
}
var v1 = pdb.add(0,0,500);
console.log(v1);
console.log(pdb.db[v1]);
var v2 = pdb.add(100,0,400);
var v3 = pdb.add(0,0,700);
var v4 = pdb.add(0,-200,500);
var v5 = pdb.add(0,0,300);
var v6 = pdb.add(-200,10,500);
var v7 = pdb.add(-200,10000,500);
var v8 = pdb.add(0,0,12000);
var things = [
    sphere_thing(v1, 80, colors[0]),
    sphere_thing(v2, 60, colors[2]),
    sphere_thing(v3, 100, colors[4]),
    sphere_thing(v4, 100, colors[3]),
    {where: cube(100, v5),
     point: v5,
     color: colors[1]},
    sphere_thing(v6, 20, colors[5]),
    sphere_thing(v7, 9800, colors[6]),
    sphere_thing(v8, 10000, colors[7]),
];
function sphere_thing(point, radius, color){
    return({where: sphere(radius, point),
            point: point,
            color: color});
};

function cron(){
    //time_step_page();
    movement([37,38,39,40,65,83]);
    draw_helper();
    setTimeout(cron, 1000/fps);
};
setTimeout(function(){
    return(cron());
}, 100);
//draw_helper();
function distance_to(v) {
    return(Math.sqrt((v.x**2) + (v.y**2) + (v.z**2)));
};
function draw_helper() {
    var p = make_3_point(0,0,0);
    var vision_points = [];
    var detail = 60;
    var db = pdb.perspective();
    //things = things.sort(function(a,b){return(db[b.point].z - db[a.point].z);});
    things = things.sort(function(a,b){return(distance_to(db[b.point]) - distance_to(db[a.point]));});
    for(var x = 0; x<detail; x++) {
        for(var y = 0; y<detail; y++){
            for(var i=0; i<things.length; i++){
                var d = make_3_point(x-(detail/2),y-(detail/2),detail);
                var L = line_maker(p, d);
                var T = things[i];
                if((visible(db[T.point])) && T.where(L, db)){
                    vision_points = vision_points.concat([[d, i, T.color]]);
                };
            };
        };
    };
    //console.log(JSON.stringify(vision_points));
    ctx.clearRect(0, 0, c.width, c.height);
    for(var i=0; i<vision_points.length; i++){
        var vp = vision_points[i];
        var p1 = three_to_two(vp[0]);
        var size = 17;
        var p2 = {y: p1.y, x: p1.x + size};
        var p3 = {y: p1.y + size, x: p1.x};
        var p4 = {y: p1.y + size, x: p1.x + size};
        draw_square(p1, p2, p4, p3, vp[2]);
        //draw_triangle(p4, p2, p3, vp[2]);
    };
    //console.log(JSON.stringify(vision_points));
};
function draw_square(p1, p2, p3, p4, color) {
    var b = true;//clockwise(p1, p2, p3);
    if (b) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.fillStyle = color;
        ctx.fill();
    }
}
function visible(Z) {
    var vision = 100000;
    return ((Z.z > 0) && (Z.z < vision) && (Z.x > -(vision/2)) && (Z.x < (vision/2)));
};
function pdb_maker() {
    var db = {type: "points"};
    var top = 0;
    return({
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
    });
};



//Controller

var controls = {37:false, 38:false, 39:false, 40:false, 65:false, 83:false};
var perspective = {x:0,z:0,theta:0};
var step_size = 10;
var turn_speed = 0.02;
function left() {
    perspective.theta += turn_speed;
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
    perspective.theta -= turn_speed;
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
    var k = event.keyCode;
    var cv = controls[k];
    if(cv == false) {
        controls[k] = true;
    };

    //var f = keys[event.keyCode];
    //if(!(f == undefined)){ f(); };
//    console.log(event.keyCode);
});
document.addEventListener('keyup', function(event) {
    var k = event.keyCode;
    var cv = controls[k];
    if(cv == true) {
        controls[k] = false;
    };
});
 
function movement(L){
    if(L.length == 0){return(0);};
    var H = L[0];
    //console.log(JSON.stringify(controls));
    if(controls[H]){
        keys[H]();
    };
    return(movement(L.slice(1)));
};


// physics

function rotation_matrix_y(angle) {
    return([
        [Math.cos(angle),0,Math.sin(angle)],
        [0,1,0],
        [-Math.sin(angle),0,Math.cos(angle)]]);
};
function in_perspective(point, rotation) {
    var X = point.x - perspective.x;
    var Y = point.y;
    var Z = point.z - perspective.z;
    var point2 = make_3_point(X, Y, Z);
    var point3 = mul_v_m(point2, rotation);
    return(point3);
};
function pos_mod(A, B) {
    return(((A % B) + B) % B);
}
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
