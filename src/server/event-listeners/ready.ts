import { CustomClient } from "../custom-client";
const { Events } = require('discord.js');
import { Config } from '../../config'

export default {
	name: Events.ClientReady,
	once: true,
	execute(client: CustomClient) {
        console.log('bot is ready...')
        client.setPresence(Config.activityType, Config.discordStatus)
	},
};
