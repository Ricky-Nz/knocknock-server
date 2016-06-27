import twilio from 'twilio';
import { TWILIO } from '../../config.js';

const client = twilio(TWILIO.accountSid, TWILIO.authToken); 

export function sendSMS({country=65, number, message}) {
	return new Promise((resolve, reject) => {
		client.messages.create({ 
		    to: `+${country}${number}`,
		    MessagingServiceSid: TWILIO.MessagingServiceSid,
		    body: message 
		}, function(err, message) {
			if (err) return reject(err);

			resolve();
		});
	});
}