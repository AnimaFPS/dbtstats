const fetch = require('node-fetch');
const commando = require('discord.js-commando');
const token = require('../../config.json')
myHeaders.append('accept', '*/*');
myHeaders.append('Authorization', 'Bearer ' + `${token}`);

module.exports = class dbtstatsCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'dbtstats',
      group: 'commands',
      memberName: 'dbtstats',
      description: 'stats for diabotical',
      examples: ['`!dbtstats Anima.`'],

      args: [
        {
          key: 'sens',
          prompt: 'What Sensitivity do you want to convert from',
          type: 'float',
        },
      ],
    });
  }

  async run(message, args) {
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

    const embed = new Discord.MessageEmbed()
        .setColor('#EFFF00')
        .setTitle(args.join(' '))
        .setThumbnail('https://diabotical.gg/static/avatar/' + userid[0].avatar + '.png')
        .addFields(
            { name: 'Matches Played', value: stats[0].match_count },
            { name: 'Frags', value: stats[0].frags },
            { name: 'Accuracy', value: (stats[0].shots_hit/stats[0].shots_fired*100).toFixed(2) + '%' }
        );

    message.send(embed);
  }
};
module.exports = {
	name: 'dbtstats',
	description: 'stats for diabotical',
    args: true,
