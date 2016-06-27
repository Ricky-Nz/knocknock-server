import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId, offsetToCursor, fromGlobalId } from 'graphql-relay';
import { GraphQLUserEdge, GraphQLLoginUser, GraphQLViewer } from '../query';
import { Users } from '../../service/database';
import { processFileUpload, updateField } from '../utils';
import { deleteFile } from '../../service/datastorage';
import { generateOTP, sendSMS } from '../../service/notification';

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

const updateProfile = mutationWithClientMutationId({
	name: 'UpdateProfile',
	inputFields: {
    newPassword: {
    	type: GraphQLString
    },
    firstName: {
      type: GraphQLString
    },
    lastName: {
      type: GraphQLString
    },
    password: {
    	type: GraphQLString
    },
    plusAccount: {
      type: GraphQLString
    }
	},
	outputFields: {
		user: {
			type: GraphQLLoginUser,
			resolve: ({localId}) => Users.findById(localId)
		}
	},
	mutateAndGetPayload: ({newPassword, firstName, lastName, password, plusAccount}, {userId}, {rootValue}) =>
		processFileUpload('knocknock-avatar', rootValue.request.file)
			.then(upload => {
				return Users.update({
					...updateField('encrypted_password', newPassword),
					...updateField('first_name', firstName),
					...updateField('last_name', lastName),
					...updateField('encrypted_password', password),
					...updateField('plus_account', plusAccount),
					...upload&&{
						profile_image_url_small: upload.imageUrl
					}
				}, {where:{id: userId}});
			})
});

const requestPhoneNumberVerify = mutationWithClientMutationId({
	name: 'RequestPhoneNumberVerify',
	inputFields: {
		countryCode: {
			type: new GraphQLNonNull(GraphQLString)
		},
    number: {
      type: new GraphQLNonNull(GraphQLString)
    }
	},
	outputFields: {
		user: {
			type: GraphQLLoginUser,
			resolve: ({userId}) => Users.findById(userId)
		}
	},
	mutateAndGetPayload: ({countryCode, number}, {userId}) => {
		const {otp, expire} = generateOTP();
		return sendSMS({country: countryCode, number, message: `Your verification code is ${otp}`})
			.then(() => Users.update({
				contact_no: `${countryCode}${number}`,
				verification_code: otp,
				verification_code_expiry: expire
			}, {where: {id: userId}}))
			.then(() => ({userId}))
	}
});

const verifyPhoneNumber = mutationWithClientMutationId({
	name: 'VerifyPhoneNumber',
	inputFields: {
    code: {
    	type: new GraphQLNonNull(GraphQLString)
    }
	},
	outputFields: {
		user: {
			type: GraphQLLoginUser,
			resolve: ({userId}) => Users.findById(userId)
		}
	},
	mutateAndGetPayload: ({code}, {userId}) =>
		Users.findOne({where:{
			id: userId,
			verification_code: code,
			verification_code_expiry: {$gt: new Date()}
		}})
		.then(user => {
			if (!user) throw 'verify code not correct';
			
			if (!user.is_verified) {
				return user.update({
					is_verified: true,
					verification_code: null,
					verification_code_expiry: null
				});
			}
		})
		.then(() => ({userId}))
});

export default {
	updateProfile,
	requestPhoneNumberVerify,
	verifyPhoneNumber
};

