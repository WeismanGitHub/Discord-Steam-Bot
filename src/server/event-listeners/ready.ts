const { Events, ActivityType } = require('discord.js');
import { CustomClient } from "../custom-client";
import { config } from '../../config'

export default {
	name: Events.ClientReady,
	once: true,
	execute(client: CustomClient) {
        console.log('bot is ready...')
        client.setPresence(ActivityType.Playing, config.discordStatus)
	},
};
