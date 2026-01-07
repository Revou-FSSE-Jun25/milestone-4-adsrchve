import { ApiProperty } from "@nestjs/swagger";

export class CreateAccountDto {}

export class AccountResponseDto {
    @ApiProperty({ description: 'Account ID', example: '123e4567-...' })
    id: String;

    @ApiProperty({ description: 'Account Number (auto-generated)', example: '22345567' })
    accountNumber: String;

    @ApiProperty({ description: 'Account balance', example: '1000000.50', type: 'number', format: 'decimal' })
    balance: number;

    @ApiProperty({ description: 'Account owner user ID', example: '123456-e89b-...' })
    userId: string;

    @ApiProperty({ description: 'Account creation timestamp', example: '2026-01-01T10:30:00Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp', example: '2026-01-01T12:30:00Z' })
    updatedAt: Date;
}