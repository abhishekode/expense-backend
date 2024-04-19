import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './middleware/http-exception.filter';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Enable Cors
	app.enableCors();

	// Set /api as prefix for all the api endpoint
	app.setGlobalPrefix('api');

	// Enable API versining
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1',
	});

	const port = process.env.PORT;
	app.useGlobalFilters(new HttpExceptionFilter());

	// Swagger config and it's setup
	const config = new DocumentBuilder()
		.setTitle('RAD API Documentation')
		.setDescription(
			'This API documentation outlines endpoints and functionality for managing rad-related data. Explore endpoints for retrieving, adding, and updating rad data efficiently.'
		)
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger-doc', app, document);

	try {
		await app.listen(port);
		console.log(`Listening on http://localhost:${port} 🚀`);
	} catch (err) {
		console.error(`Failed to start server on port ${port}:`, err);
	}
}

bootstrap();
