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
            return(seximal_data.place_value_words[m]);
        }, -12, 12);
        places = words[1];
        var m2 = m / Math.pow(6, places);
        words = words[0];
        var words2 = to_nifty_words(
            seximal,
            seximal_data.nifty_words);
        var words3 = m.toString(36)
            .toUpperCase();
        var words4 = m.toString(6);
            //to_nifty_words(
            //seximal,
            //seximal_data.nifty_symbols);
        //var words4 = to_nifty_words(
        //    seximal,
        //    seximal_data.nifty_sixes);
        num_result.innerHTML = "rounded: "
            .concat(four_digits(m2))
            .concat(" ")
            .concat(words)
            .concat("<br> seximal: ")
            .concat(words4)
            .concat("<br> nifty: ")
            .concat(words3)
            .concat("<br> pronounciation of nifty: ")
            .concat(words2)
        ;
    };

    function convertToSeximal(){

        var meters = to_seximal_text.value;
        meters = parseFloat(meters, 10);
        var seximal = meters.toString(6);

        var words = to_words(seximal, function(m){
            return(seximal_data
                   .place_prefixes[m]
                   .concat("meters"));
        }, -12, 2);
        places = words[1];
        meters = meters / Math.pow(6, places);
        words = words[0];
        meters_result.innerHTML = four_digits(meters)
            .concat(" ")
            .concat(words);
    };
    function digits_to_point(s) {
        if(s.length === 0) {
            return(0);
        } else if(s[0] === ".") {
            return(0);
        } else {
            return 1 + digits_to_point(s.slice(1));
        };
    };
    function to_nifty_words(seximal, wordlist) {
        var d = digits_to_point(seximal);
        if((d%2) === 1) {
            seximal = "0".concat(seximal);
        };
        return(to_nifty_words2(seximal, wordlist));
    };
    function to_nifty_words2(s, wordlist) {
        if(s === "") {
            return("");
        } if (s === ".") {
            return("");
        } if (s[0] === ".") {
            return(". ".concat(
                to_nifty_words2(s.slice(1), wordlist)));
        } if (s.length === 1) {
            var x = parseInt(s, 6);
            x = x * 6;
            return(wordlist[x]);
        } else {
            var x = parseInt(s.slice(0, 2), 6);
            return(wordlist[x]
                   .concat("")
                   .concat(to_nifty_words2(s.slice(2), wordlist)));
        };
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
        //var units = place_prefixes[m].concat("meters");
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
