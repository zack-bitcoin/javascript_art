//<div style="line-height:24%;">

(function(){
    function br() {
        return document.createElement("br");
    };
    function div() {
        return document.createElement("div");
    };

    var short_div = div();
    short_div.style = "line-height:24%;";
    var long_div = div();
    long_div.style = "line-height:124%;";

    function add_string(div, S) {
    //// if you use spans to name the text, then the text can be edited later without having to rewrite the entire div.
    //var span1 = document.createElement("span");
    //span1.innerHTML = S;
    //div.appendChild(span1);

    //// this makes it identical to the html example.
        div.insertAdjacentHTML('beforeend', S);
    };
    function add_letters(){
        add_string(short_div, "abc def ghi");
    };
    function add_numbers(){
        add_string(long_div, "123 456 789");
    };

    add_letters();
    short_div.appendChild(br());
    add_letters();
    short_div.appendChild(br());
    add_letters();

    add_numbers();
    long_div.appendChild(br());
    add_numbers();
    long_div.appendChild(br());
    add_numbers();

    document.body.appendChild(short_div);
    document.body.appendChild(long_div);
})();
