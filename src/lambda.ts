import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';
import { Context, Handler } from 'aws-lambda';
import express from 'express';

import { AppModule } from './app.module';
import { ResponseHeaderInterceptor } from './response-header.interceptor';

let cachedServer: Handler;

async function bootstrap() {
	if (!cachedServer) {
		const expressApp = express();
		const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
		nestApp.useGlobalInterceptors(new ResponseHeaderInterceptor());

		if (!process.env.WHITELIST_DOMAIN) process.env.WHITELIST_DOMAIN = '*';
		const WHITELIST_DOMAIN = process.env.WHITELIST_DOMAIN.split(',');

		if (WHITELIST_DOMAIN.length) {
			if (WHITELIST_DOMAIN.includes('*')) {
				nestApp.enableCors();
			} else {
				nestApp.enableCors({
					origin: function (origin, callback) {
						if (WHITELIST_DOMAIN.indexOf(origin) !== -1) {
							callback(null, true)
						} else {
							callback(new Error('Not allowed by CORS'))
						}
					},
					allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
					methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
					credentials: true,
				});
			}
		}
		await nestApp.init();
		cachedServer = serverlessExpress({ app: expressApp });
	}
	return cachedServer;
}

export const handler = async (event: any, context: Context, callback: any) => {
	// temporary fix to replace + with space in case of ALB only
	if (event.hasOwnProperty('queryStringParameters')) {
		for (const key in event.queryStringParameters) {
			event.queryStringParameters[key] = event.queryStringParameters[key].replace(/\+/g, ' ');
		}
	}
	const server = await bootstrap();
	return server(event, context, callback);
};