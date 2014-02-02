var net = require('net');
var bot = new net.Socket();
var fs = require('fs');
var server = "irc.freenode.net", // teh server
    port = "6667", //port
    channel = "#merimarzi", // teh channel
    botnick = "JSL4M3B047", //nick/handle for teh bot
    insults; // will hold insults

fs.readFile('insults.txt', function(err, data) {
    if(err) throw err;
    insults = data.toString().split("\n");
});

bot.setEncoding('utf8');
bot.connect(port, server, function() {
    console.log('CONNECTED TO: ' + server + ':' + port);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    bot.write("USER "+ botnick +" "+ botnick +" "+ botnick +" :"+botnick+" tells hello.\n");
    bot.write("NICK "+ botnick +"\n");
    bot.write("I iz a bot"+"\n");
    bot.write("JOIN "+ channel +"\n");
});

//this is like while 1, till the time data is received keep responding, data is 
//an event.
bot.on('data', function(data) {
    var insult, nicktoinsult, datastr = data.toString();
    console.log('DATA: ' + datastr.trim());
    if(data.indexOf("PING :") !== -1){
        bot.write("PONG :pingis\n");
    }
    if(data.indexOf(":Hello") !== -1){
        bot.write("PRIVMSG "+ channel +" :Hello!\n");
    }
    if((data.indexOf("insult "+botnick) !== -1)){
        bot.write("PRIVMSG "+ channel +" :wow. such command. \r\n");
    }else if(data.indexOf("insult") !== -1){
        insult = insults[Math.floor(Math.random() * insults.length)];
        nicktoinsult = getnick(datastr);
        bot.write("PRIVMSG "+ channel +" :"+ nicktoinsult +" " +insult+"\r\n");
    }
});

function getnick(msg){
    var regx = /insult(.*)/,
        match;
    match = regx.exec(msg);
    if(match !== null){
        return match[1];
    }
    return;
}

// a 'close' event handler for the client socket
bot.on('close', function() {
    console.log('Connection closed');
});