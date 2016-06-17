import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLUserEdge, GraphQLUser, GraphQLViewer } from '../query';
import { Users } from '../../service/database';
import { processFileUpload, updateField } from '../utils';
import { deleteFile } from '../../service/datastorage';

// id      
// first_name      
// last_name     
// contact_no      
// credit      
// points      
// profile_image_url_small     
// profile_image_url_medium      
// profile_image_url_big     
// gender      
// code      
// age     
// marital_status      
// have_child      
// have_maid     
// occupation      
// nationality     
// orders_count      
// rank      
// disabled      
// first_login     
// created_on      
// email     
// encrypted_password      
// reset_password_token      
// reset_password_sent_at      
// is_imported     
// created_by      
// verification_code     
// is_verified     
// birth_month     
// birth_year      
// adv_source      
// referral_code     
// verification_code_expiry      
// stripe_customer_id      
// android_app_version     
// ios_app_version     
// plus_account

const createUser = mutationWithClientMutationId({
	name: 'CreateUser',
	inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
    	type: new GraphQLNonNull(GraphQLString)
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
		userEdge: {
			type: GraphQLUserEdge,
			resolve: (newUser) => ({
				cursor: offsetToCursor(0),
				node: newUser
			})
		},
		viewer: {
			type: GraphQLViewer,
			resolve: () => ({})
		}
	},
	mutateAndGetPayload: ({email, password, firstName, lastName, contact, enabled}, context, {rootValue}) =>
		processFileUpload('knocknock-avatar', rootValue.request.file)
			.then(upload => Users.create({
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

const updateUser = mutationWithClientMutationId({
	name: 'UpdateUser',
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
		user: {
			type: GraphQLUser,
			resolve: ({localId}) => User.findById(localId)
		}
	},
	mutateAndGetPayload: ({id, password, firstName, lastName, contact, enabled}, context, {rootValue}) =>
		processFileUpload('knocknock-avatar', rootValue.request.file)
			.then(upload => {
				const {id: localId} = fromGlobalId(id);
				return Users.update({
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
				}, {where:{id: localId}});
			})
});

export default {
	createUser,
	updateUser
};