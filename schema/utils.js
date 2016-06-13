import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import moment from 'moment';
import { uploadFile } from '../service/datastorage';
import { connectionFromPromisedArraySlice, cursorToOffset, fromGlobalId } from 'graphql-relay';
import { DBOrder } from '../service/database';
import Chance from 'chance';

export function updateField(fieldName, value) {
  return (value!==undefined)&&{
    [fieldName]: value
  };
}

export function generateCode(argument) {
  var chance = new Chance();
  return chance.string({pool: 'poiuytrewqasdfghjklmnbvcxz1234567890', length: 12});
}

export function toDisplayDate(date) {
  return moment(date).format("MMM Do YYYY");
}

export function formatTime(date, hour=0, minute=0, second=0, millisecond=0) {
  let format = new Date(date);
  format.setHours(hour);
  format.setMinutes(minute);
  format.setSeconds(second);
  format.setMilliseconds(millisecond);
  return format;
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

export function verifyPassword(password, encryptedPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, encryptedPassword, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

export function generateToken(userId) {
  return jwt.sign({ id: userId }, 'knocknockserver-secret-token');
}

export function verifyToken(token) {
  console.log(token);
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'knocknockserver-secret-token', function(err, payload) {
      if (err) {
        reject('invalid token!');
      } else {
        resolve(payload.id);
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

