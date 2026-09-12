import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    DeleteObjectCommand,
    HeadObjectCommand,
    PutObjectCommand,
    S3Client,
    S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { R2ObjectMetadata } from './types/r2-object-metadata';

@Injectable()
export class R2StorageService {
    private readonly client: S3Client;
    private readonly bucketName: string;

    constructor(private readonly configService: ConfigService) {
        const accountId = this.configService.getOrThrow<string>('R2_ACCOUNT_ID');
        const accessKeyId = this.configService.getOrThrow<string>('R2_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.getOrThrow<string>('R2_SECRET_ACCESS_KEY');

        this.bucketName = this.configService.getOrThrow<string>('R2_BUCKET_NAME');

        this.client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }

    async createUploadUrl(
        objectKey: string,
        contentType: string,
        expiresIn = 300,
    ): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: objectKey,
            ContentType: contentType,
        });

        return getSignedUrl(this.client, command, {
            expiresIn,
        });
    }



    async getObjectMetadata(objectKey: string): Promise<R2ObjectMetadata | null> {
        try {
            const command = new HeadObjectCommand({
                Bucket: this.bucketName,
                Key: objectKey,
            });

            const result = await this.client.send(command);

            return {
                contentType: result.ContentType ?? null,
                sizeBytes: result.ContentLength ?? null,
            };
        } catch (error) {
            if (
                error instanceof S3ServiceException &&
                error.$metadata.httpStatusCode === 404
            ) {
                return null;
            }

            throw error;
        }
    }

    async deleteObject(objectKey: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: objectKey,
        });

        await this.client.send(command);
    }

    getPublicUrl(objectKey: string): string {
        const publicUrl = this.configService
            .getOrThrow<string>('R2_PUBLIC_URL')
            .replace(/\/$/, '');

        return `${publicUrl}/${objectKey}`;
    }
}