const fetch = require('node-fetch');
const Discord = require('discord.js');
let myHeaders = new Headers();
myHeaders.append('accept', '*/*');
myHeaders.append('Authorization', 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjhmNTZkOWIyZmE1NDAzZjk4NTFjNDgwYjdhMjQwOGQiLCJpYXQiOjE2MDgyNzQ4MDUsImV4cCI6MTYwODM2MTIwNX0.Cv5NTiGySLkZ8GI4voGaTe4M-0J8ei5-k6GJyavj9Mo');

module.exports = {
	name: 'matches',
	description: 'Displys the Last 15 Matches of a Specified Player',
    args: true,
    usage: '<ign>',
	async execute(message, args) {
        
        const name = encodeURIComponent(args.join(' '));
		const userid = await fetch('https://www.diabotical.com/api/v0/userlist/' + name, {method: 'GET',
            headers: myHeaders
        }).then(response => response.json());

        if (!userid.length) {
            return message.channel.send(`No results found for **${args.join(' ')}**.`);
        }
        
        const  matchlist = await fetch('https://www.diabotical.com/api/v0/users/' + userid[0].user_id + '/matches', {method: 'GET',
            headers: myHeaders
        }).then(response => response.json());

        //gun:7 is PNCR
        //gun:4 is Rocket
        //
        const embed = new Discord.MessageEmbed()
            .setColor('#EFFF00')
            .setTitle(args.join(' ') + '\u0027s Last ' + matchlist.matches.length + ' matches')

        for ( var i=0; i < matchlist.matches.length; i++) {
            let date = new Date(matchlist.matches[i].create_ts);
            if (matchlist.matches[i].team_placement == 1){
                embed.addField('Match ' + (i+1), '\u274C  Lost,     Mode: ' + matchlist.matches[i].match_mode +  ',     Map: ' + matchlist.matches[i].match_map + '\n Match Id: ' + matchlist.matches[i].match_id);
            } else {
                embed.addField('Match ' + (i+1), '\u2705 Won,     Mode: ' + matchlist.matches[i].match_mode +  ',     Map: ' + matchlist.matches[i].match_map + '\n Match Id: ' + matchlist.matches[i].match_id);
            }
        }


        message.channel.send(embed);
        },
    };