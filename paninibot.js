//import firebase from "./config/fire";
const token = 'NTgyMDEyNDI3MDI2MTY5ODc3.XcidPg.fEDK-VzfJBxvLDZsmm8K4FvOdAA';
var port = process.env.PORT || 1337;
const discord = require('discord.js');
const client = new discord.Client();
const express = require('express')
const app = express();
const cheerio = require('cheerio');
const request = require('request');
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');


client.on('ready', () => {
    client.user.setActivity("With Himself")
});

client.on('guildMemberAdd', member => {
    member.send("Welcome to Blackrock Down's Discord server. Before diving in use `!rules` to view our servers rules!");
});



client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) {
        return;
    }
    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage);
    }

});

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0];
    let arguments = splitCommand.slice(1);

    if (primaryCommand == "harold")
    {
        hankCommand(arguments, receivedMessage);
        console.log(arguments);
    }
}


function hankCommand(arguments, receivedMessage) {
    switch(arguments[0]) {
        case "random":
            randomFunction(receivedMessage);
            break;
        case "r34":
            pornFunction(arguments, receivedMessage);
            break;
        case "stream":
            streamFunction(arguments, receivedMessage);
            break;
        case "play":
            playFunction(receivedMessage);
            break;
        case "roll":
            rollFunction(arguments, receivedMessage);
            break;
        case "pick":
            pickFunction(arguments, receivedMessage);
            break;
        case "git":
            gitFunction(receivedMessage);
            break;
        case "help":
            helpFunction(receivedMessage);

    };
}


async function randomFunction(receivedMessage) {
    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + "Panini Chowder",
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    };
    request(options, function(error, response, responseBody) {
        if (error) {
            return;
        }
 
 
        $ = cheerio.load(responseBody); 
 
        var links = $(".image a.link");
 

        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
        console.log(urls);
        if (!urls.length) {
            return;
        }
        var randomimg = urls[Math.floor(Math.random() * urls.length)];
        receivedMessage.channel.send(randomimg);
    });
    return;
}

async function pornFunction(arguments, receivedMessage) {
    arguments.shift();
    var name = arguments.join("_");
    console.log(name)
    fetch('https://r34-json-api.herokuapp.com/posts?tags=' + name)
    .then(response => response.json())
    .then(data => {
        console.log(data[0].file_url)
        var randompron = data[Math.floor(Math.random() * data.length)];
        receivedMessage.channel.send(randompron.file_url);
    })
    .catch(err =>{
        console.log(err)
    });
}

async function streamFunction(arguments, receivedMessage) {
    const streamOptions = { seek: 0, volume: .5 };
    if (receivedMessage.member.voiceChannel) {
        receivedMessage.member.voiceChannel.join()
            .then(connection => {
                receivedMessage.reply('Music Time!');
                const stream = ytdl(arguments[1], {filter: "audioonly"});
                const dispatcher = connection.playStream(stream, streamOptions);
                dispatcher.on("end", end => {
                    console.log("Song done");
                    receivedMessage.guild.me.voiceChannel.leave()
                });
            }).catch(console.log);
        }
    return;
}

async function playFunction(receivedMessage) {
    const streamOptions = { seek: 0, volume: .5 };
        var args = ['https://www.youtube.com/watch?v=bXcSLI58-h8', 'https://www.youtube.com/watch?v=Ysu4b-deqTQ'];
        var randsong = args[Math.floor(Math.random() * args.length)];
        if (receivedMessage.member.voiceChannel) {
            receivedMessage.member.voiceChannel.join()
              .then(connection => { // Connection is an instance of VoiceConnection
                receivedMessage.reply('I have successfully connected to the channel!');
                const stream = ytdl(randsong, {filter: 'audioonly'});
                const dispatcher = connection.playStream(stream, streamOptions);
                dispatcher.on("end", end => {
                console.log("left channel");
                receivedMessage.guild.me.voiceChannel.leave()
            });
              })
              .catch(console.log);
        }
    return;
}

async function rollFunction(arguments, receivedMessage) {
    if(arguments[1] === "") {
        receivedMessage.reply(Math.floor(Math.random()*100)+1);
    } else {
        receivedMessage.reply(Math.floor(Math.random() * arguments[1])+1);
    }
    return;
}

async function pickFunction(arguments, receivedMessage) {
    arguments.shift();
    var finalPick = arguments[Math.floor(Math.random()*arguments.length)];
    receivedMessage.reply("I chose " + finalPick);
    return;
}

async function gitFunction(receivedMessage) {
    fetch("https://api.github.com/repos/DrVario/discobot")
    .then(response => response.json())
    .then(data => {
        console.log(data[0])
        var gitinfo = data[0];
        receivedMessage.channel.send(gitinfo.sha, gitinfo.author, gitinfo.message );
    })
    .catch(err =>{
        console.log(err);
    });
    return;
}

async function helpFunction(receivedMessage) {
    receivedMessage.channel.send('Commands include `hey`, `play`, `stream <url>`, `random`');
    return;
}

var http = require("http");
setInterval(function() {
    http.get("http://paninibot.herokuapp.com");
}, 300000); 


client.login('NTgyMDEyNDI3MDI2MTY5ODc3.XcidPg.fEDK-VzfJBxvLDZsmm8K4FvOdAA');

app.listen(port, () => console.log(`Harold is listening on port ${port}!`));