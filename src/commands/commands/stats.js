const fetch = require('node-fetch');
const Discord = require('discord.js');
let myHeaders = new Headers();
myHeaders.append('accept', '*/*');
myHeaders.append('Authorization', 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjhmNTZkOWIyZmE1NDAzZjk4NTFjNDgwYjdhMjQwOGQiLCJpYXQiOjE2MDgyNzQ4MDUsImV4cCI6MTYwODM2MTIwNX0.Cv5NTiGySLkZ8GI4voGaTe4M-0J8ei5-k6GJyavj9Mo');

module.exports = {
	name: 'stats',
	description: 'Displays Overall Statistics for a Specified player',
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

        const stats = await fetch('https://www.diabotical.com/api/v0/users/' + userid[0].user_id + '/stats', {method: 'GET',
            headers: myHeaders
        }).then(response => response.json());

        //gun:7 is PNCR
        //gun:4 is Rocket
        //
        const embed = new Discord.MessageEmbed()
            .setColor('#EFFF00')
            .setTitle(args.join(' '))
            .setThumbnail('https://diabotical.gg/static/avatar/' + userid[0].avatar + '.png')
            .addFields(
                { name: 'Matches Played', value: stats[0].match_count + ' (won ' + (stats[0].match_won/stats[0].match_count*100).toFixed(2) + '%' + ')'},
                { name: 'Frags', value: '**Average**: ' + (stats[0].frags/stats[0].match_count).toFixed(2) + ' (' + (stats[0].frags/stats[0].deaths).toFixed(2) + ' K/D)' + '\n' 
                    + '**Most**: ' + stats[0].most_frags + '\n' 
                    + '**Total**: ' +stats[0].frags 
                },
                { name: 'Accuracy', value: (stats[0].shots_hit/stats[0].shots_fired*100).toFixed(2) + '%' }
            );

        message.channel.send(embed);
        },
    };