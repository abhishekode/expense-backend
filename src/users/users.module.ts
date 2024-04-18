import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './users.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';
import { ConfigModule } from '@nestjs/config';
import { DriverDocumentsSchema } from 'src/driver-documents/driver-documents.schema';
import { AdminSchema } from 'src/admin/admin.schema';

@Module({
	imports: [
		ConfigModule,
		MongooseModule.forFeature([
			{ name: 'User', schema: UserSchema },
			{ name: 'DriverDocuments', schema: DriverDocumentsSchema },
			{ name: 'Admin', schema: AdminSchema },
		]),
		JwtModule.register({
			global: true,
			secret: jwtConstants.secret,
			signOptions: { expiresIn: jwtConstants.expiresIn },
		}),
	],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}
