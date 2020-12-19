const fetch = require('node-fetch');
const Discord = require('discord.js');
let myHeaders = new Headers();
myHeaders.append('accept', '*/*');
myHeaders.append('Authorization', 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjhmNTZkOWIyZmE1NDAzZjk4NTFjNDgwYjdhMjQwOGQiLCJpYXQiOjE2MDgyNzQ4MDUsImV4cCI6MTYwODM2MTIwNX0.Cv5NTiGySLkZ8GI4voGaTe4M-0J8ei5-k6GJyavj9Mo');

module.exports = {
	name: 'shaft',
	description: 'Displays Shaft Accuracy',
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

        var shaftacc;

        for (var i=0; i < stats.length; i++){
            if ((stats[i].filter == 'gun:5') && (stats[i].time_frame == "alltime")) {
                shaftacc = (stats[i].shots_hit/stats[i].shots_fired*100).toFixed(2);
            }
        }
        message.channel.send(args.join(' ') + '\u0027s Shaft Accuracy: ' + shaftacc + '%');
        },
    };