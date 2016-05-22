import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { uploadFile } from '../datastorage';

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

export function processFileUpload(args, file) {
	return new Promise((resolve, reject) => {
		if (!file) return resolve(args);

		const localFilePath = path.join(__dirname, '..', file.path);

		uploadFile('knocknock-laundry', localFilePath)
			.then(file => {
				fs.unlink(localFilePath);
				
				const imageBucket = file.metadata.bucket;
				const imageId = file.id;
				const imageUrl = `https://storage.googleapis.com/${imageBucket}/${imageId}`
				resolve({...args, imageUrl, imageBucket, imageId});
			})
			.catch(err => reject(err));
	});
}