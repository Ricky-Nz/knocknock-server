import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLWorkerEdge, GraphQLWorker, GraphQLViewer } from '../query';
import { Workers } from '../../service/database';
import { processFileUpload, updateField } from '../utils';
import { deleteFile } from '../../service/datastorage';

// id			
// first_name			
// last_name			
// points			
// contact_no			
// profile_image_url_small			
// profile_image_url_medium			
// profile_image_url_big			
// can_view_worker			
// disabled			
// note			
// created_on			
// email			
// encrypted_password			
// reset_password_token			
// reset_password_sent_at			
// color_hash			
// location_updated_at			
// latitude			
// longitude			
// last_known_location			
// is_factory_worker			
// factory_id			
// sort_order

const createWorker = mutationWithClientMutationId({
	name: 'CreateWorker',
	inputFields: {
		email: {
			type: new GraphQLNonNull(GraphQLString)
		},
		password: {
			type: new GraphQLNonNull(GraphQLString)
		},
		firstName: {
			type: new GraphQLNonNull(GraphQLString)
		},
		lastName: {
			type: new GraphQLNonNull(GraphQLString)
		},
		contact: {
			type: new GraphQLNonNull(GraphQLString)
		},
		enabled: {
			type: GraphQLBoolean
		}
	},
	outputFields: {
		workerEdge: {
			type: GraphQLWorkerEdge,
			resolve: (worker) => ({
				cursor: offsetToCursor(0),
				node: worker
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: ({email, password, firstName, lastName, contact, enabled}, context, {rootValue}) =>
		processFileUpload('knocknock-avatar', rootValue.request.file)
			.then(upload => Workers.create({
				email,
				encrypted_password: password,
				first_name: firstName,
				last_name: lastName,
				contact_no: contact,
				disabled: !enabled,
				...upload&&{
					profile_image_url_small: upload.imageUrl
				}
			}))
});

const updateWorker = mutationWithClientMutationId({
	name: 'UpdateWorker',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		},
		password: {
			type: GraphQLString
		},
		firstName: {
			type: GraphQLString
		},
		lastName: {
			type: GraphQLString
		},
		contact: {
			type: GraphQLString
		},
		enabled: {
			type: GraphQLBoolean
		}
	},
	outputFields: {
		worker: {
			type: GraphQLWorker,
			resolve: ({localId}) => Workers.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, password, firstName, lastName, contact, enabled}, context, {rootValue}) =>
		processFileUpload('knocknock-avatar', rootValue.request.file)
			.then(upload => {
				const {id: localId} = fromGlobalId(id);
				return Workers.update({
						...updateField('encrypted_password', password),
						...updateField('first_name', firstName),
						...updateField('last_name', lastName),
						...updateField('contact_no', contact),
						...(enabled!==undefined)&&{
							disabled: !enabled
						},
						...upload&&{
							profile_image_url_small: upload.imageUrl
						}
					}, {where:{id: localId}}).then(() => ({localId}))
			})
});

const deleteWorker = mutationWithClientMutationId({
	name: 'DeleteWorker',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		deletedId: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: ({id}) => id
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: ({id}) => {
		const {id: localId} = fromGlobalId(id);
		return Workers.destory({where:{id: localId}})
			.then(() => ({id}));
	}
});

export default {
	createWorker,
	updateWorker,
	deleteWorker
};


