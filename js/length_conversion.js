(function(){

    var div = document.createElement("div");
    document.body.appendChild(div);

    
    var to_seximal_text = document.createElement("input");
    to_seximal_text.type = "text";
    div.appendChild(to_seximal_text);
    div.appendChild(document.createElement("br"));

    var to_seximal_button =
        document.createElement("input");
    to_seximal_button.type = "button";
    to_seximal_button.value = "convert meters to seximal";
    to_seximal_button.onclick = convertToSeximal;
    div.appendChild(to_seximal_button);
    div.appendChild(document.createElement("br"));

    var meters_result = document.createElement("p");
    div.appendChild(meters_result);
    div.appendChild(document.createElement("br"));

    var num2seximal_text =
        document.createElement("input");
    num2seximal_text.type = "text";
    div.appendChild(num2seximal_text);
    div.appendChild(document.createElement("br"));

    var num2seximal_button = 
        document.createElement("input");
    num2seximal_button.type = "button";
    num2seximal_button.value = "convert a decimal number to seximal";
    num2seximal_button.onclick = num2seximal_fun;
    div.appendChild(num2seximal_button);
    div.appendChild(document.createElement("br"));

    var num_result = document.createElement("p");
    div.appendChild(num_result);
    div.appendChild(document.createElement("br"));

    function four_digits(n){
        n = n.toString(6);
        if(n.match(/\.\d\d\d\d/)){
            n = n.match(/[^.]*\.\d\d\d\d/)[0];
        };
        return(n);
    };

    function num2seximal_fun(){

        var m = num2seximal_text.value;
        m = parseFloat(m, 10);
        var seximal = m.toString(6);

        var words = to_words(seximal, function(m){
            return(place_value_words[m]);
        }, -12, 12);
        places = words[1];
        m = m / Math.pow(6, places);
        words = words[0];
        num_result.innerHTML = four_digits(m)
            .concat(" ")
            .concat(words);

    };

    function convertToSeximal(){

        var meters = to_seximal_text.value;
        meters = parseFloat(meters, 10);
        var seximal = meters.toString(6);

        var words = to_words(seximal, function(m){
            return(place_preffixes[m].concat("meters"));
        }, -12, 2);
        places = words[1];
        meters = meters / Math.pow(6, places);
        words = words[0];
        meters_result.innerHTML = four_digits(meters)
            .concat(" ")
            .concat(words);
    };

    var place_value_roots = [
        "unexian",
        "biexian",
        "triexian",
        "quadexian",
        "pentexian",
        "unnilexian",
        "ununexian",
        "umbiexian",
        "untriexian",
        "unquadexian",
        "unquadexian",
        "umpentexian",
        "binilexian"
    ];
    var place_value_words = {};
    for(var i = 0; i<place_value_roots.length; i++){
        place_value_words[i+1] =
            place_value_roots[i];
        place_value_words[-i-1] =
            place_value_roots[i].concat("ths");
        place_value_words[0] = "";
    };


    var place_preffixes = {
        2:"great-grand",
        1:"grand",
        0:"",
        "-1":"unti",
        "-2":"biti",
        "-3":"triti",
        "-4":"quadi",
        "-5":"penti",
        "-6":"unnilti",
        "-7":"ununti",
        "-8":"umbiti",
        "-9":"untriti",
        "-10":"unquadi",
        "-11":"umpenti",
        "-12":"binilti"
    };

    function to_words(s, f, lower, upper){
        if(s.match(/^0\./)){
            s = s.slice(1);
        };
        var n;
        if(s[0] === "."){
            n = place_value_below_one(
                s.slice(1),
                0);
        } else {
            n = place_value(s, 0);
        };
        n = n - 1;
        var m = Math.floor(n/4);
        if(m > upper) {
            m = upper;
        };
        if(m < lower){
            m = lower;
        };
        var units = f(m);
        //var units = place_preffixes[m].concat("meters");
        return([units, m*4]);

    };
    function place_value_below_one(s, n){
        if(s[0] === "0"){
            return(place_value_below_one(
                s.slice(1), n-1));
        } else {
            return(n);
        };
    };
    function place_value(s, n){
        if(s.length === 0){
            return(n);
        } else if(s[0] === "."){
            return(n);
        } else {
            return(place_value(
                s.slice(1),
                n+1));
        };
    };
    

})();
