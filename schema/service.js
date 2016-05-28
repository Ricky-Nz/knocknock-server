import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { uploadFile } from '../datastorage';
import {
  connectionFromPromisedArraySlice,
  cursorToOffset
} from 'graphql-relay';

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

