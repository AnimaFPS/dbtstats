const fetch = require('node-fetch');
const Discord = require('discord.js');
let myHeaders = new Headers();
myHeaders.append('accept', '*/*');
myHeaders.append('Authorization', 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjhmNTZkOWIyZmE1NDAzZjk4NTFjNDgwYjdhMjQwOGQiLCJpYXQiOjE2MDgyNzQ4MDUsImV4cCI6MTYwODM2MTIwNX0.Cv5NTiGySLkZ8GI4voGaTe4M-0J8ei5-k6GJyavj9Mo');

module.exports = {
	name: 'match',
	description: 'Displayes Match Stats from a Match ID',
    args: true,
    usage: '<match id>',
    async execute(message, args) {
		const matchstats = await fetch('https://www.diabotical.com/api/v0/match/' + args, {method: 'GET',
            headers: myHeaders
        }).then(response => response.json());

        if (matchstats.match === null) {
            return message.channel.send(`No match found for Match id: **${args.join(' ')}**.`);
        }

        let date = new Date(matchstats.match.create_ts);

        const embed = new Discord.MessageEmbed()
            .setColor('#EFFF00')
            .setTitle(matchstats.match.match_mode + ' on ' + matchstats.match.match_map )
            .addField('Date/ Time of Match', date.toUTCString())
        

        var team1players = '';
        var team2players = '';
        var team1frags = '';
        var team2frags = '';
        var team1score = '';
        var team2score = '';
        var team1asists = '';
        var team2asists = '';
        var team1deaths = '';
        var team2deaths = ''; 
        var team1inflicted = '';
        var team2inflicted = '';
        var team1taken = '';
        var team2taken = '';

        for ( var i=0; i < matchstats.match.clients.length; i++) {
            if (matchstats.match.clients[i].team_idx == 0){
                team1players += '\n' + matchstats.match.clients[i].name;
                if (matchstats.match.clients[i].finished) {
                    team1frags += '\n' + matchstats.match.clients[i].stats.f;
                    team1score += '\n' + matchstats.match.clients[i].stats.s;
                    team1asists += '\n' + matchstats.match.clients[i].stats.a;
                    team1inflicted += '\n' + matchstats.match.clients[i].stats.di;
                    team1taken += '\n' + matchstats.match.clients[i].stats.dt;
                    team1deaths += '\n' + matchstats.match.clients[i].stats.d;
                } else {
                    team1frags += '\n';
                    team1score += '\n';
                    team1asists += '\n';
                    team1inflicted += '\n';
                    team1taken += '\n';
                    team1deaths += '\n';
                }
            } else {
                team2players += '\n' + matchstats.match.clients[i].name;
                if (matchstats.match.clients[i].finished) {
                    team2frags += '\n' + matchstats.match.clients[i].stats.f;
                    team2score += '\n' + matchstats.match.clients[i].stats.s;
                    team2asists += '\n' + matchstats.match.clients[i].stats.a;
                    team2inflicted += '\n' + matchstats.match.clients[i].stats.di;
                    team2taken += '\n' + matchstats.match.clients[i].stats.dt;
                    team2deaths += '\n' +matchstats.match.clients[i].stats.d;
                } else {
                    team2frags += '\n';
                    team2score += '\n';
                    team2asists += '\n';
                    team2inflicted += '\n';
                    team2taken += '\n';
                    team2deaths += '\n';
                }
            }
        }

        
        embed.addFields(
            { name: matchstats.match.teams[0].name + ' Score', value: matchstats.match.teams[0].score},
            { name: matchstats.match.teams[0].name, value: team1players, inline: true},
            { name: 'Score', value: team1score, inline: true},
            { name: 'Frags', value: team1frags, inline: true},
            { name: 'Deaths', value: team1deaths, inline: true},
            { name: 'Asists', value: team1asists, inline: true},
            { name: 'Inflicted', value: team1inflicted, inline: true},
            { name: 'Taken', value: team1taken, inline: true},
            { name: matchstats.match.teams[1].name + ' Score', value: matchstats.match.teams[1].score},
            { name: matchstats.match.teams[1].name, value: team2players, inline: true},
            { name: 'Score', value: team2score, inline: true},
            { name: 'Frags', value: team2frags, inline: true},
            { name: 'Deaths', value: team2deaths, inline: true},
            { name: 'Asists', value: team2asists, inline: true},
            { name: 'Inflicted', value: team2inflicted, inline: true},
            { name: 'Taken', value: team2taken, inline: true}
        )

        message.channel.send(embed);
        },
    };
	