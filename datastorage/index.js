import gcloud from 'gcloud';
import path from 'path';

const gcs = gcloud.storage({
	projectId: 'knocknock-976',
	keyFilename: path.join(__dirname, '..', 'gcloud-cert.json')
});

const colthBucket = gcs.bucket('knocknock-laundry');

export function uploadFile (filePath) {
	return new Promise((resolve, reject) => {
		colthBucket.upload(filePath, function (err, file, apiResponse) {
			if (err) {
				reject(err);
			} else {
				resolve(file);
			}
		});
	})
}