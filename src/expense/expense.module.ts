import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { expenseSchema } from './expense.schema';
import { UserSchema } from 'src/users/users.schema';

@Module({
	imports: [
		ConfigModule,
		MongooseModule.forFeature([
			{ name: 'Expense', schema: expenseSchema },
			{ name: 'User', schema: UserSchema },
		]),
	],
	controllers: [ExpenseController],
	providers: [ExpenseService],
})
export class ExpenseModule {}
