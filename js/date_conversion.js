(function(){
    //Dec 21, 2020 is day 0.

    //365.2425
    //1/4 - 3/400 = 97/400
    

    //leap years have 366 days. non-leap years have 360 days.

    //leap years over-count by 303/400 days.
    //non leap years under-count by 2097/400 days

    //7 leap years + 1 non-leap year = lose -24/400 of a day.
    //after 16.666 sets of 8 years = 133.28 years, we lose a full day.
    //in about 3 centuries we can add a correction, the planet speed is also not constant, so we need corrections anyway.

    //8 years has 366*7 + 360 days = 2922 days

    var div = document.createElement("div");
    document.body.appendChild(div);

    var defaults = new Date();

    var dec_day_label = document.createElement("span");
    dec_day_label.innerHTML = "decimal day";
    div.appendChild(dec_day_label);
    var select_dec_day = document.createElement("select");
    add_options(select_dec_day, 1, 32);
    //select_dec_day.value = 20;
    select_dec_day.value = defaults.getDate();
    div.appendChild(select_dec_day);

    div.appendChild(document.createElement("br"));
    var dec_month_label = document.createElement("span");
    dec_month_label.innerHTML = "decimal month";
    div.appendChild(dec_month_label);
    var select_dec_month = document.createElement("select");
    add_options(select_dec_month, 1, 13);
    //select_dec_month.value = 12;
    select_dec_month.value = defaults.getMonth()+1;
    div.appendChild(select_dec_month);

    div.appendChild(document.createElement("br"));
    var dec_year_label = document.createElement("span");
    dec_year_label.innerHTML = "decimal year";
    div.appendChild(dec_year_label);
    var dec_year_text = document.createElement("input");
    dec_year_text.type = "text";
    //dec_year_text.value = "2020";
    dec_year_text.value = defaults.getFullYear();
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
    
    dec2seximal_fun();
    
    function seximal2dec_fun(){
        var s = sex_date_text.value.trim();
        var year = s.match(/^-?\d*\./)[0].slice(0, -1);
        var nif = s.match(/\.\d\d\./)[0].slice(1, -1);
        var day = s.match(/\.\d\d$/)[0].slice(1);
        year = to10(year);
        nif = to10(nif);
        day = to10(day);

        var octs = 0;
        if(year > 0){
            octs = Math.floor(year/8);
        } else {
            octs = Math.ceil((year)/8);
        };
        var year = year % 8;
        
        var days = day + (nif*36) + (year*366) + (octs*2922);
        var millis_since = days*24*60*60*1000;
        var start = new Date(2020, 11, 21);
        start.setTime(start.getTime() + millis_since);
        decimal_date.innerHTML = start.toUTCString().slice(0, 16);
    };
    
    function dec2seximal_fun(){
        var day = parseInt(select_dec_day.value, 10);
        var month = parseInt(select_dec_month.value, 10)-1;
        var year = parseInt(dec_year_text.value, 10);
        var d = days_since(day, month, year);
        var date = days2date(d);
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
        if(days > 0){
            octs = Math.floor(days / 2922);
        } else if (days < 0){
            octs = Math.ceil((days+1) / 2922);
        };
        days = days % 2922;
        var years = 8*octs;
        if(days > 0){
            years = Math.floor(days / 366) + years;
        } else if (days === 0){
            
        } else if (days < 0){
            years = Math.ceil((days+1) / 366) + years-1;
        }
        var days = days % 366;
        if(days < 0){
            days = days + 366;
        };
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
