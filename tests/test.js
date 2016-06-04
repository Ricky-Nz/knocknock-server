// Load Chance
var Chance = require('chance');

// Instantiate Chance so it can be used
var chance = new Chance();

console.log(chance.string({pool: 'poiuytrewqasdfghjklmnbvcxz1234567890', length: 12}));