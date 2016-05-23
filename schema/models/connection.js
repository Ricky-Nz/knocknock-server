import {
  connectionFromPromisedArraySlice,
  cursorToOffset
} from 'graphql-relay';

export function modelConnection (dbClass, query, args) {
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