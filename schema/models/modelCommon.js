export function buildModel(staticFields, getMutableFields, outputFields, actions) {
	return {
		inputs: {
			...staticFields,
			...getMutableFields()
		},
		updates: {
			id: {
				type: new GraphQLNonNull(GraphQLString),
				description: 'update item id'
			},
			...getMutableFields(true)
		},
		fields: {
			...staticFields,
			...getMutableFields(false, true),
			...outputFields
		},
		...actions
	};
}