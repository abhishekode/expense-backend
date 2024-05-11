import { Injectable } from '@nestjs/common';
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { v2 } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
	constructor() {
		v2.config({
			cloud_name: 'cloudinary',
			api_key: '',
			api_secret: '',
		});
	}

	async uploadImage(
		filename: Express.Multer.File
	): Promise<UploadApiResponse | UploadApiErrorResponse> {
		// Check if the size of the file is more than 1M
		if (filename.size > 1000000) {
			throw new Error('Please upload a file size not more than 1M');
		}
		// Check if the file is an image
		if (!filename.mimetype.startsWith('image')) {
			throw new Error('Sorry, this file is not an image, please try again');
		}
		const uploadStream = v2.uploader.upload_stream({ folder: 'profileImage' });

		const result = (await new Promise((resolve, reject) => {
			uploadStream.on('error', (error) => reject(error));
			uploadStream.on(
				'finish',
				(result: UploadApiResponse | PromiseLike<UploadApiResponse>) =>
					resolve(result)
			);

			const readableStream = Readable.from(filename.buffer);
			readableStream.pipe(uploadStream);
		})) as UploadApiResponse;

		return result;
	}

	async deleteImageByUrl(imageUrl: string): Promise<void> {
		const publicId = this.getPublicIdFromUrl(imageUrl);
		await v2.uploader.destroy(publicId);
	}

	private getPublicIdFromUrl(imageUrl: string): string {
		const parts = imageUrl.split('/');
		const fileName = parts.pop()!;
		const publicId = fileName.split('.')[0];
		return publicId;
	}
}
