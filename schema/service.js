import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import { uploadFile } from '../datastorage';
import { connectionFromPromisedArraySlice, cursorToOffset, fromGlobalId } from 'graphql-relay';
import { DBOrder } from '../database';

export function formatDate(date) {
  return moment(new Date(date)).format();
}

export function calculateOrderId(userId) {
  return DBOrder.findOne({where:{userId}, order: 'serialNumber DESC'})
    .then(order => {
      const count = order?(parseInt(order.serialNumber.slice(15)) + 1):1;
      if (count > 999) {
        throw 'reach order limit';
      } else {
        const {id} = fromGlobalId(userId);
        const idprefix = moment().format('YYYYMMDD') + ('0000000' + id).slice(-7);
        return idprefix + ('000' + count).slice(-3);
      }
    });
}

export function calculateTimeRnage(after, before) {
  let selection = {$and: {}};
  
  if (after) {
    selection['$and']['$gte'] = moment(after).format();
  }
  if (before) {
    selection['$and']['$lt'] = moment(before).format(); 
  }
  
  return selection;
}

export function modelConnection(dbClass, query, args) {
  return dbClass.count(query)
    .then((count) => {
      query.offset = 0;

      if (args.first) {
        query.limit = args.first;
      } else if (args.last) {
        query.limit = args.last;
        query.offset = Math.max(0, count - args.last);
      } 

      if (args.after) {
        query.offset = cursorToOffset(args.after) + 1;
      } else if (args.before) {
        const offset = cursorToOffset(args.before);
        query.offset = Math.max(0, offset - args.last);
      }

      return connectionFromPromisedArraySlice(dbClass.findAll(query), args, {
        sliceStart: query.offset,
        arrayLength: count
      });
    });
}

export function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'knocknockserver-secret-token', function(err, userId) {
      if (err) {
        reject('invalid token!');
      } else {
        resolve(userId);
      }
    });
  });
}

export function processFileUpload(bucket, file) {
	return new Promise((resolve, reject) => {
		if (!file) return resolve();

		const localFilePath = path.join(__dirname, '..', file.path);

		uploadFile(bucket, localFilePath)
			.then(file => {
				fs.unlink(localFilePath);
				
				const imageBucket = file.metadata.bucket;
				const imageId = file.id;
				const imageUrl = `https://storage.googleapis.com/${imageBucket}/${imageId}`
				resolve({imageUrl, imageBucket, imageId});
			})
			.catch(err => reject(err));
	});
}

