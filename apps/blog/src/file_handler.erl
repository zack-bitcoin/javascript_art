
-module(file_handler).

-export([init/2, init/3, handle/2, terminate/3]).
%example of talking to this handler:
%httpc:request(post, {"http://127.0.0.1:3011/", [], "application/octet-stream", "echo"}, [], []).
%curl -i -d '[-6,"test"]' http://localhost:3011
init(Req, Opts) ->
	handle(Req, Opts).
handle(Req, State) ->
    F = cowboy_req:path(Req),
    PrivDir0 = "../../../../js",
    PrivDir = list_to_binary(PrivDir0),
    true = case F of
	       <<"/codecBytes.js">> -> true;
	       <<"/puzzle_league.js">> -> true;
	       <<"/puzzle_league2.js">> -> true;
	       <<"/puzzle_league_instructions.html">> -> true;
	       <<"/puzzle_league.html">> -> true;
	       <<"/black.png">> -> true;
	       <<"/blue.png">> -> true;
	       <<"/cursor.png">> -> true;
	       <<"/green.png">> -> true;
	       <<"/red.png">> -> true;
	       <<"/yellow.png">> -> true;
	       <<"/crypto.js">> -> true;
	       <<"/cube.html">> -> true;
	       <<"/cube.js">> -> true;
	       <<"/format.js">> -> true;
	       <<"/main.html">> -> true;
	       <<"/password.html">> -> true;
	       <<"/pw_generator.js">> -> true;
	       <<"/favicon.ico">> -> true;
	       <<"/sjcl.js">> -> true;
	       <<"/spiral.html">> -> true;
	       <<"/spiral.js">> -> true;
	       <<"/signing.js">> -> true;
	       <<"/spots3.png">> -> true;
	       <<"/spots2.png">> -> true;
	       <<"/spots.png">> -> true;
	       <<"/spots.png">> -> true;
	       <<"/board.html">> -> true;
	       <<"/board.js">> -> true;
	       <<"/black_go.png">> -> true;
	       <<"/white_go.png">> -> true;
	       <<"/star_go.png">> -> true;
	       <<"/empty_go.png">> -> true;
	       <<"/mark_go.png">> -> true;
               X -> 
                   io:fwrite("ext file handler block access to: "),
                   io:fwrite(X),
                   io:fwrite("\n"),
                   false
           end,
    %File = << PrivDir/binary, <<"/external_web">>/binary, F/binary>>,
    File = << PrivDir/binary, F/binary>>,
    {ok, _Data, _} = cowboy_req:read_body(Req),
    Headers = #{<<"content-type">> => <<"text/html">>,
    <<"Access-Control-Allow-Origin">> => <<"*">>},
    Text = read_file(File),
    Req2 = cowboy_req:reply(200, Headers, Text, Req),
    {ok, Req2, State}.
read_file(F) ->
    {ok, File } = file:open(F, [read, binary, raw]),
    {ok, O} =file:pread(File, 0, filelib:file_size(F)),
    file:close(File),
    O.
init(_Type, Req, _Opts) -> {ok, Req, []}.
terminate(_Reason, _Req, _State) -> ok.
