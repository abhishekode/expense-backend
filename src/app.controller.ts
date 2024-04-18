import { Controller, Get, Version } from '@nestjs/common';

@Controller()
export class AppController {
	@Version('1')
	@Get()
	getHello(): { message: string } {
		return { message: 'Welcome to RAD-API. This is the home page.' };
	}

}
