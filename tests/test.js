// import { Users } from '../service/database';

// Users.findAll({where:{credit:2448.75}})
// 	.then(result => result.map(({dataValues}) => console.log(dataValues)));


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

var stripe = require("stripe")(
  "sk_test_TXuRIWwqiRZq4PgtAdlL14wp"
);

stripe.customers.listCards('cus_8fM3LisAMXTxIv', function(err, cards) {
  console.log(cards);
});