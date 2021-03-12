(function(){
    var div = document.createElement("div");
    document.body.appendChild(div);

    var hour_label = document.createElement("span");
    hour_label.innerHTML = "hour";
    div.appendChild(hour_label);
    var select_hour = document.createElement("select");
    add_options(select_hour, 0, 23);
    div.appendChild(select_hour);
    //div.appendChild(document.createElement("br"));

    var minute_label = document.createElement("span");
    minute_label.innerHTML = "minute";
    div.appendChild(minute_label);
    var select_minute = document.createElement("select");
    add_options(select_minute, 0, 59);
    div.appendChild(select_minute);
    div.appendChild(document.createElement("br"));

    var convert = document.createElement("input");
    convert.type = "button";
    convert.value = "convert to seximal";
    convert.onclick = convertTime;
    div.appendChild(convert);
    div.appendChild(document.createElement("br"));
    var seximal_result = document.createElement("div");
    div.appendChild(seximal_result);
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));



    var to_decimal = document.createElement("input");
    to_decimal.type = "text";
    div.appendChild(to_decimal);
    var to_decimal_button = document.createElement("input");
    to_decimal_button.type = "button";
    to_decimal_button.value = "convert to decimal";
    to_decimal_button.onclick = convertToDecimal;
    div.appendChild(to_decimal_button);
    var decimal_result = document.createElement("div");
    div.appendChild(decimal_result);
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createElement("br"));

    function convertToDecimal(){
        var v = parseInt(to_decimal.value, 6);
        var day = v / (6*6*6*6);
        var now = new Date();
        var off = now.getTimezoneOffset();
        day = day - (off / (24*60));
        var hours = day * 24;
        var hours2 = Math.floor(hours);
        var minutes = Math.round(60*(hours - hours2)).toString();
        if(minutes.length === 1){
            minutes = "0".concat(minutes);
        };
        decimal_result.innerHTML = hours2.toString()
            .concat(":")
            .concat(minutes);
    };

    function convertTime(){
        var now = new Date();
        var off = now.getTimezoneOffset();

        var m = parseInt(select_minute.value, 10);
        var h = parseInt(select_hour.value, 10);
        var t = (h*60) + m + off;
        if(t < 0){
            t = t + (24*60);
        };
        seximal_day = t / (24*60);
        var seximal_spans =
            seximal_day * 216 * 6;
        var time = seximal_spans.toString(6)
            .match(/[^.]*.?\d?\d?\d?/)[0];
        seximal_result.innerHTML = time;
        //return(time);
    };
    
    function add_options(select, start, end){
        for(var i = start; i<end; i++){
            var option = document.createElement("option");
            option.innerHTML = i;
            option.value = i;
            select.appendChild(option);
        };
    };
})();
