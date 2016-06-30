import { Users } from '../service/database';

Users.findAll({where:{email:'oo@gmail.com'}})
	.then(result => result.map(({dataValues}) => console.log(dataValues)));
	
// 5XW71267S5505635Y
	   //  token: function(token) {
	   //  	console.log(token.card.id);
				// var http = new XMLHttpRequest();
				// http.open('POST', '/api/stripe/charge', true);
				// //Send the proper header information along with the request
				// http.setRequestHeader("Content-type", "application/json");
				// http.onreadystatechange = () => {
			 //    if(http.readyState == 4) {
			 //    	console.log(http.response);
			 //    }
				// };
				// http.send(JSON.stringify({token:token.card.id}));
	   //  }

// import { requestPaypalExpressUrl } from '../service/payment/paypal';

// requestPaypalExpressUrl({amount: 20.5, currency: 'SGD'})
// 	.then(response => console.log(response))
// 	.catch(err => console.log(err));

// { id: 1, status: 'Pending Worker', stage: 0 }
// { id: 2, status: 'Worker found', stage: 1 }
// { id: 3, status: 'Awaiting pick up', stage: 2 }
// { id: 4, status: 'Laundry in progress', stage: 3 }
// { id: 5, status: 'Laundry Complete', stage: 4 }
// { id: 6, status: 'Awaiting drop off', stage: 5 }
// { id: 7, status: 'Laundry dropped off', stage: 6 }
// { id: 8, status: 'Order complete', stage: 7 }
// { id: 9, status: 'Deleted', stage: 8 }
// { id: 10, status: 'Pickup Failed', stage: 9 }
// { id: 11, status: 'Drop off Failed', stage: 10 }
// { id: 12, status: 'Picked Up', stage: 22 }
// { id: 13, status: 'Awaiting Loading', stage: 35 }