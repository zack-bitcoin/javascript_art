(function(){
    //Dec 21, 2020 is day 0.

    //365.2425
    //1/4 - 3/400 = 97/400
    

    //leap years have 366 days. non-leap years have 360 days.

    //leap years over-count by 303/400 days.

    //after 6/(303/400) years, we need a non-leap year. = 2400/303 = 800/101

    //8 years has 366*7 + 360 days = 2922 days

    var div = document.createElement("div");
    document.body.appendChild(div);


    var dec_day_label = document.createElement("span");
    dec_day_label.innerHTML = "decimal day";
    div.appendChild(dec_day_label);
    var select_dec_day = document.createElement("select");
    add_options(select_dec_day, 1, 32);
    div.appendChild(select_dec_day);

    div.appendChild(document.createElement("br"));
    var dec_month_label = document.createElement("span");
    dec_month_label.innerHTML = "decimal month";
    div.appendChild(dec_month_label);
    var select_dec_month = document.createElement("select");
    add_options(select_dec_month, 1, 13);
    div.appendChild(select_dec_month);

    div.appendChild(document.createElement("br"));
    var dec_year_label = document.createElement("span");
    dec_year_label.innerHTML = "decimal year";
    div.appendChild(dec_year_label);
    var dec_year_text = document.createElement("input");
    dec_year_text.type = "text";
    dec_year_text.value = "2021";
    div.appendChild(dec_year_text);

    var dec2seximal = document.createElement("input");
    dec2seximal.type = "button";
    dec2seximal.value = "decimal to seximal";
    dec2seximal.onclick = dec2seximal_fun;
    div.appendChild(dec2seximal);
    div.appendChild(document.createElement("br"));

    var seximal_date = document.createElement("p");
    div.appendChild(seximal_date);


    
    var sex_date_label = document.createElement("span");
    sex_date_label.innerHTML = "seximal date";
    div.appendChild(sex_date_label);
    var sex_date_text = document.createElement("input");
    sex_date_text.type = "text";
    sex_date_text.value = "100.14.05";
    div.appendChild(sex_date_text);

    var seximal2dec = document.createElement("input");
    seximal2dec.type = "button";
    seximal2dec.value = "seximal to decimal";
    seximal2dec.onclick = seximal2dec_fun;
    div.appendChild(seximal2dec);
    div.appendChild(document.createElement("br"));

    var decimal_date = document.createElement("p");
    div.appendChild(decimal_date);
    

    
    /*
    var test = document.createElement("input");
    test.type = "button";
    test.value = "test";
    test.onclick = test_fun;
    div.appendChild(test);
    div.appendChild(document.createElement("br"));
    */

    function test_fun(){
        var d = days2date(1000);
        console.log(d);
    };

    function seximal2dec_fun(){
        var s = sex_date_text.value.trim();
        var year = s.match(/^\d*\./)[0].slice(0, -1);
        var nif = s.match(/\.\d\d\./)[0].slice(1, -1);
        var day = s.match(/\.\d\d$/)[0].slice(1);
        year = to10(year);
        nif = to10(nif);
        day = to10(day);

        var octs = Math.floor(year/8);
        var year = year % 8;
        
        var days = day + (nif*36) + (year*366) + (octs*2922);
        var millis_since = days*24*60*60*1000;
        var start = new Date(2020, 11, 21);
        start.setTime(start.getTime() + millis_since);
        console.log(start.toUTCString());
        decimal_date.innerHTML = start.toUTCString().slice(0, 16);
    };
    
    function dec2seximal_fun(){
        var day = parseInt(select_dec_day.value, 10);
        var month = parseInt(select_dec_month.value, 10)-1;
        var year = parseInt(dec_year_text.value, 10);
        var d = days_since(day, month, year);
        var date = days2date(d);
        console.log([day, month, year, d]);
        console.log(date);
        var sex_day = date[0];
        var sex_month = date[1];
        var sex_year = date[2];

        seximal_date.innerHTML = "year.nif.day: "
            .concat(sex_year)
            .concat(".")
            .concat(sex_month)
            .concat(".")
            .concat(sex_day);
    };

    function leap_year(n){
        var ys = n-2021;
        return(!((ys % 8) === 7));
    };

    function days_since(day, month, year){
        var now = new Date(year, month, day);
        var start = new Date(2020, 11, 21);
        var d = Math.round((now - start)/(1000*60*60*24));
        return(d);
    };

    function to6(n){
        s = n.toString(6);
        if(s.length === 1){
            s = "0".concat(s);
        };
        return(s);
    };

    function to10(n){
        return(parseInt(n, 6));
    };

    function days2date(days){
        var octs = 0;
        if(days > 2922){
            octs = Math.floor(days / 2922);
            days = days % 2922;
        };
        var years = Math.floor(days / 366) +
            (8*octs);
        var days = days % 366;
        var nifs = Math.floor(days / 36);
        var days = days % 36;
        return([to6(days), to6(nifs), to6(years)]);
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
