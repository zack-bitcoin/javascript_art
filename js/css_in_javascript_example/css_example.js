
//<div style="line-height:24%;display:inline-block;">

function br() {
    return document.createElement("br");
};
function div() {
    return document.createElement("div");
};
function span(){
    return document.createElement("span");
};

var short_div = div();
short_div.style = "line-height:24%;";

function add_string(div, S) {
    var span1 = span();
    span1.innerHTML = S;
    div.appendChild(span1);
};
function add_letters(){
    add_string(short_div, "abc def ghi");
};

add_letters();
short_div.appendChild(br());
add_letters();
short_div.appendChild(br());
add_letters();

var long_div = div();
long_div.style = "line-height:124%;";

function add_numbers(){
    add_string(long_div, "123 456 789");
};

add_numbers();
long_div.appendChild(br());
add_numbers();
long_div.appendChild(br());
add_numbers();

document.body.appendChild(short_div);
document.body.appendChild(long_div);
