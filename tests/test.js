
function test(test) {
	return {
		id: 'TT',
		...test&&{
			test: 'test'
		}
	};
}

console.log(test());
console.log(test(true));