import stripe from 'stripe';
import config from '../../config';

const stripeClient = stripe(config.stripe.secret);

export function payByStripeToken({
	amount,
	description,
	tokenId
}) {
	return stripeClient.charges.create({
	  amount,
	  currency: "sgd",
	  source: tokenId,
	  description
	});
}

export function createCustomer({
	tokenId
}) {
	return stripeClient.customers.create({
	  source: tokenId
	});
}

export function createCard({
	customerId,
	tokenId
}) {
	return stripeClient.customers.createSource(
	  customerId,
	  { source: tokenId }
	);
}

export function payByStripeCardId({
	customerId,
	cardId,
	amount,
	description
}) {
	return stripeClient.charges.create({
	  amount,
	  currency: "sgd",
	  customer: customerId,
	  card: cardId,
	  description
	});
}