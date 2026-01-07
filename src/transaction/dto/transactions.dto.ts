import { ApiProperty } from "@nestjs/swagger";
import { IsPositive, IsUUID, IsNumber, Min } from "class-validator";

export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAW = 'WITHDRAW',
    TRANSFER = 'TRANSFER'
}

// Deposit
export class DepositDto {
    @ApiProperty({ description: 'Destination account ID to deposit', example: '123e4567-...' })
    @IsUUID('4', { message: 'Account ID must be a valid UUID' })
    toAccountId: string;

    @ApiProperty({ description: 'Amount to deposit (minimum 100000)', example: 500000.75, minimum: 100000, type: 'number', format: 'decimal' })
    @IsNumber({ maxDecimalPlaces: 2}, { message: 'Amount must be a valid decimal number' })
    @IsPositive({ message: 'Amount must be positive' })
    @Min(100000, { message: 'Minimum deposit amount is 100000' })
    amount: number;
}

// Withdraw
export class WithdrawDto {
    @ApiProperty({ description: 'Source account ID to withdraw', example: '123e4567-...' })
    @IsUUID('4', { message: 'Account ID must be a valid UUID' })
    fromAccountId: string;

    @ApiProperty({ description: 'Amount to withdraw (minimum 20000)', example: 50000, minimum: 10000, type: 'number', format: 'decimal' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Amount must be a valid decimal number' })
    @IsPositive({ message: 'Amount must be positive' })
    @Min(20000, { message: 'Minimum withdrawal amount is 20000' })
    amount: number;
}

// Transfer
export class TransferDto {
    @ApiProperty({ description: 'Source account ID', example: '1234e567-...' })
    @IsUUID('4', { message: 'Source account ID must be a valid UUID' })
    fromAccountId: string;

    @ApiProperty({ description: 'Destination account ID', example: '9876b321-...' })
    @IsUUID('4', { message: 'Destination account ID must be a valid UUID' })
    toAccountId: string;

    @ApiProperty({ description: 'Amount to transfer (minimum 10000)', example: 10000.50, minimum: 10000, type: 'number', format: 'decimal' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Amount must be a valid decimal number' })
    @IsPositive({ message: 'Amount must be positive' })
    @Min(10000, { message: 'Minimum transfer amount is 10000' })
    amount: number;
}