import gcloud from 'gcloud';
import path from 'path';

const gcs = gcloud.storage({
	projectId: 'knocknock-976',
	keyFilename: path.join(__dirname, 'gcloud-cert.json')
});

export function uploadFile (bucket, filePath) {
	return new Promise((resolve, reject) => {
		gcs.bucket(bucket).upload(filePath, function (err, file, apiResponse) {
			if (err) {
				reject(err);
			} else {
				resolve(file);
			}
		});
	})
}

export function deleteFile (bucket, fileId) {
	return new Promise((resolve, reject) => {
		const file = gcs.bucket(bucket).file(fileId);
		if (!file) return resolve();

		file.delete((err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}