var seximal_data = (function(){


    var nifty_words = [
        "pama ","befa ","tiva ","dona ","kusa ","gaza ",
	"penge ","bime ","tofe ","duve ","kane ","gese ",
	"pizi ","bongi ","tumi ","dafi ","kevi ","gini ",
	"poso ","buzo ","tango ","demo ","kifo ","govo ",
	"punu ","basu ","tezu ","dingu ","komu ","gufu ",
	"pavr ","benr ","tisr ","dozr ","kungr ","gamr "
    ];
    var nifty_symbols = [
        "0", "1", "2", "3", "4", "5",
        "6", "7", "8", "9", "A", "B",
        "C", "D", "E", "F", "G", "H",
        "I", "J", "K", "L", "M", "N",
        "O", "P", "Q", "R", "S", "T",
        "U", "V", "W", "X", "Y", "Z"
    ];
    var nifty_sixes = [
        "00","01","02","03","04","05",
        "10","11","12","13","14","15",
        "20","21","22","23","24","25",
        "30","31","32","33","34","35",
        "40","41","42","43","44","45",
        "50","51","52","53","54","55",
    ];
    var digits = [
        "pa", "be", "ti", "do", "ku", "gr"
    ];
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
    var place_prefixes = {
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


    return({
        digits: digits,
        nifty_symbols: nifty_symbols,
        nifty_words: nifty_words,
        place_value_words: place_value_words,
        place_prefixes: place_prefixes,
        nifty_sixes: nifty_sixes
    });
})();
