export function modelConnection (dbClass, query, args) {
  return dbClass.count(query)
    .then((count) => {
      query.skip = 0;

      if (args.first) {
        query.limit = args.first;
      } else if (args.last) {
        query.limit = args.last;
        query.skip = Math.max(0, count - args.last);
      } 

      if (args.after) {
        query.skip = cursorToOffset(args.after) + 1;
      } else if (args.before) {
        const offset = cursorToOffset(args.before);
        query.skip = Math.max(0, offset - args.last);
      }

      return connectionFromPromisedArraySlice(dbClass.findAll(query), args, {
        sliceStart: query.skip,
        arrayLength: count
      });
    });
}