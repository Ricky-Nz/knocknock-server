import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import moment from 'moment';
import { uploadFile } from '../service/datastorage';
import { connectionFromPromisedArraySlice, cursorToOffset, fromGlobalId } from 'graphql-relay';
import { DBOrder, Items, Orders } from '../service/database';
import Chance from 'chance';

export function formatOrderTime(hour) {
  if (hour < 10) {
    return `0${hour}:00:00`;
  } else {
    return `${hour}:00:00`;
  }
}

export function formatPrice(price, display) {
  const formatPrice = parseFloat(price).toFixed(2);
  if (display) {
    return formatPrice;
  }
  
  return parseFloat(formatPrice);
}

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

export function formatSelectDate(year, month, dayOfMonth) {
  let start = moment([year, month, dayOfMonth]);
  let end = moment([year, month, dayOfMonth]);

  return {
    start: start.toDate(),
    end: end.add(1, 'd').toDate()
  };
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

export function prepareOrderItems(localOrderId, orderItems) {
  const clothIds = orderItems.map(item => {
    const {id} = fromGlobalId(item.productId);
    return id;
  });

  return Items.findAll({where:{id:{$in:clothIds}}})
    .then(clothes => {
      const items =  orderItems.map(({productId, quantity, washType}) => {
        const {id: localClothId} = fromGlobalId(productId);
        const cloth = clothes.find(cloth => cloth.id == localClothId);

        let itemPrice;
        switch(washType) {
          case 'wash':
            if (cloth.have_discount_wash_iron_price) {
              itemPrice = cloth.discount_wash_iron_price;
            } else {
              itemPrice = cloth.wash_iron_price;
            }
            break;
          case 'dry':
            if (cloth.have_discount_dry_clean_price) {
              itemPrice = cloth.discount_dry_clean_price;
            } else {
              itemPrice = cloth.dry_clean_price;
            }
            break;
          case 'iron':
            if (cloth.have_discount_iron_price) {
              itemPrice = cloth.discount_iron_price;
            } else {
              itemPrice = cloth.iron_price;
            }
            break;
        }

        return {
          order_id: localOrderId,
          item_id: localClothId,
          quantity,
          laundry_type: washType,
          price: itemPrice
        };
      });

      let totalPrice = 0;
      for (const index in items) {
        const item = items[index];
        totalPrice += (parseInt(item.quantity) * parseFloat(item.price));
      }

      return Orders.update({total_price: totalPrice}, {where:{id:localOrderId}})
        .then(() => items);
    });
}
