import { Injectable } from '@nestjs/common';
import type multer from 'multer';
import type { ObjectCannedACL } from '@aws-sdk/client-s3';
import {
	S3Client,
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { URL } from 'url';
import path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Service {
	private readonly s3Client: S3Client;
	private readonly AWS_S3_BUCKET: string = 'abhi-sweet';
	private accessKeyId = this.configService.get('AWS_S3_ACCESS_KEY');
	private secretAccessKey = this.configService.get('AWS_S3_SECRET_ACCESS_KEY');

	constructor(private readonly configService: ConfigService) {
		this.s3Client = new S3Client({
			region: 'ap-south-1',
			credentials: {
				accessKeyId: this.accessKeyId,
				secretAccessKey: this.secretAccessKey,
			},
			forcePathStyle: true,
		});
	}

	checkFileType = (
		file: Express.Multer.File,
		cb: multer.FileFilterCallback
	) => {
		const allowedFiletypes = /\.(jpeg|jpg|png|gif|txt|pdf|doc|docx)$/i;
		const extname = allowedFiletypes.test(path.extname(file.originalname));
		if (!extname) {
			const error = new Error('File type not supported') as any;
			cb(error, false);
		} else {
			cb(null, true);
		}
	};

	uploadToS3 = async (
		folderName: string,
		files: Express.Multer.File | Express.Multer.File[]
	) => {
		try {
			if (!Array.isArray(files)) {
				files = [files];
			}

			const uploadPromises = files.map(async (file) => {
				const originalFileName = file.originalname
					.replace(/\s+/g, '-')
					.toLowerCase();
				const fileName = `expense/${folderName}/${originalFileName}`;
				const uploadParams = {
					Bucket: this.AWS_S3_BUCKET,
					Key: fileName,
					Body: file.buffer,
					ContentType: file.mimetype,
					ACL: 'public-read' as ObjectCannedACL,
				};

				const putObjectCommand = new PutObjectCommand(uploadParams);
				await this.s3Client.send(putObjectCommand);

				return `https://${this.AWS_S3_BUCKET}.s3.amazonaws.com/${fileName}`;
			});

			return Promise.all(uploadPromises);
		} catch (error) {
			console.error('Failed to upload files to S3:', error);
			throw new Error(`Failed to upload files to S3`);
		}
	};
	deleteS3ObjectByUrl = async (objectUrl: string) => {
		try {
			const url = new URL(objectUrl);
			const bucketName = url.hostname.split('.')[0];
			const objectKey = url.pathname.slice(1);

			const deleteObjectCommand = new DeleteObjectCommand({
				Bucket: bucketName,
				Key: objectKey,
			});

			await this.s3Client.send(deleteObjectCommand);
			return true;
		} catch (error) {
			console.error(`Failed to delete object with URL ${objectUrl}.`, error);
			return false;
		}
	};

	getObjectStreamFromUrl = async (objectUrl: string) => {
		try {
			const url = new URL(objectUrl);
			const bucketName = url.hostname.split('.')[0];
			const objectKey = url.pathname.slice(1);

			const getObjectCommand = new GetObjectCommand({
				Bucket: bucketName,
				Key: objectKey,
			});

			const response = await this.s3Client.send(getObjectCommand);
			const stream = new Readable({
				read() {
					this.push(response.Body);
					this.push(null);
				},
			});

			return stream;
		} catch (error) {
			console.error(`Failed to retrieve object with URL ${objectUrl}.`, error);
			return null;
		}
	};
}
