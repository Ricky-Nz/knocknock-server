var gcsAdapter = require('skipper-gcs')
var projectId = 'knocknock-976';
var bucket = 'knocknock';

module.exports = {
	uploadToGCS: function (file, cb) {
		if (!file) return cb();

    file.upload({
      adapter: gcsAdapter,
      projectId: projectId,
      bucket: bucket
    }, function (err, files) {
      if (err) return cb(err);
    	
    	cb(null, files&&files[0]&&
    		('https://storage.googleapis.com/' + bucket + '/' + files[0].fd));
    });
	}
};