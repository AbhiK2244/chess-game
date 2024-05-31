const express = require("express");
const http = require("http");
const socket = require("socket.io");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);
const port = 3000;

const chess = new Chess();
let players = {};
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index", {title: "Chess game"});
});

//socket unique info hai about someone who has connected to our server
io.on("connection", function(socket) {
    console.log("connected",socket.id);

    if(!players.white) {
        players.white = socket.id;
        socket.emit("playerRole", "w");
    } else if(!players.black) {
        players.black = socket.id;
        socket.emit("playerRole", "b");
    } else {
        socket.emit("spectatorRole");
    }

    socket.on("move", (move)=>{
        try{
            //invalid moves
            if(chess.turn() === 'w' && socket.id !== players.white) return;
            if(chess.turn() === 'b' && socket.id !== players.black) return;

            // valid moves
            let result = chess.move(move);
            console.log("result is:  ", result);
            if(result){
                //if move is valid then value of currentPlayer will be updated to next player.
                currentPlayer = chess.turn();

                //if move is valid then the frontend move also should be updated. And this will be send to all the clients
                io.emit("move", move);
                // console.log("move is:  ", move);

                //new state of board will be send to the forntend using fen
                //Forsyth–Edwards Notation (FEN) is a standard way to describe a chess board position in a single line of text. FEN is made up of ASCII characters and has six fields
                io.emit("boardState", chess.fen());
                // console.log("fen is:  ", chess.fen());
            } else {
                console.log("Invalid move: ",move);
                socket.emit("invalidMove", move);
            }
        } catch(err) {
            //when queen moved L shape
            console.log("Not a valid move:  " + err);
            socket.emit("Invalid move", move);
        }
    });
 
    socket.on("disconnect", ()=>{
        console.log("disconnected", socket.id);
        if(socket.id === players.white){
            delete players.white;
        } else if(socket.id == players.black)
        {
            delete players.black;
        }
    });


    // socket.on("check", ()=>{
    //     console.log("checked");
    // }) 
    // setInterval(()=>{
    //     socket.emit("micTesting", "Hello kena xhihi bhai");
    // }, 2000)
});


server.listen(port, () => {
    console.log("listening on port " + port);
});
