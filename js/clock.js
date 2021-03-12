var clock = (function(){
    var div = document.createElement("div");
    document.body.appendChild(div);

    var clock = document.createElement("div");
    document.body.appendChild(clock);

    cron();

    function cron(){
        var t = time_now();
        var spans = t.match(/\d*\./)[0].slice(0,-1);
        var words = "";
        if (spans.length > 3){
            words = two_digits_to_word(spans.slice(0,-2))
                .concat(" lapse ");
            spans = spans.slice(2);
        };
        if (spans.length > 2){
            words = two_digits_to_word(spans[0])
                .concat(" lapse ");
            spans = spans.slice(1);
        };
        if (spans.length > 1){
            words = words
                .concat(two_digits_to_word(spans))
            //.concat(" spans ");
                .concat(" lull ");
        };
        words = words
            .concat(two_digits_to_word(t.match(/\.\d\d/)[0].slice(1))
                    .concat(" moments"))

        clock.innerHTML = "<h2>"
            .concat(t)
            .concat("</h2>")
            .concat("<h4>")
            .concat(words)
            .concat("</h4>");
        setTimeout(cron, 100);
    };

    function two_digits_to_word(d){
        if(d === "0"){
            return("zero");
        } else if(d === "1"){
            return("one");
        } else if(d === "2"){
            return("two");
        } else if(d === "3"){
            return("three");
        } else if(d === "4"){
            return("four");
        } else if(d === "5"){
            return("five");
        } else if(d === "10"){
            return("six");
        } else if(d === "11"){
            return("seven");
        } else if(d === "12"){
            return("eight");
        } else if(d === "13"){
            return("nine");
        } else if(d === "14"){
            return("ten");
        } else if(d === "15"){
            return("eleven");
        } else if(d === "20"){
            return("dozen");
        } else {
            var dozens = d[0];
            var ones = d[1];
            var words = "";
            if(dozens === "2"){
                words = words
                    .concat("dozen");
            } else if (dozens === "3"){
                words = words
                    .concat("thirsy");
            } else if (dozens === "4"){
                words = words
                    .concat("foursy");
            } else if (dozens === "5"){
                words = words
                    .concat("fifsy");
            };
            if(!(dozens === "0")){
                words = words.concat(" ");
            };
            if(!(ones === "0")){
                words = words
                    .concat(two_digits_to_word(ones));
            };
            return(words);
        };
    };

    function time_now(){
        var d = new Date();
        var hours = d.getUTCHours();
        var minutes = d.getUTCMinutes();
        var seconds = d.getUTCSeconds();
        var milis = d.getUTCMilliseconds();
        var seximal_day =
            (((((((milis/1000) +
                  seconds) / 60) +
                minutes) / 60) +
              hours) / 24);
        var seximal_spans =
            seximal_day * 216 * 6;
        var spans_string = seximal_spans.toString(6);
        if(!(spans_string.match(/\./))){
            spans_string =
                spans_string
                .concat(".000");
        };
        var time = spans_string.toString(6)
            .match(/[^.]*\.\d?\d?\d?/)[0];
        return(time);
    };

    return({ time_now: time_now});
})();
