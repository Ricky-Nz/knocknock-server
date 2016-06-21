import { UserCredits } from '../service/database';

UserCredits.findAll({where:{approved_by:'paypal'}})
	.then(result => result.map(({dataValues}) => console.log(dataValues)));


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