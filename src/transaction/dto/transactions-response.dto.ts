import { ApiProperty } from "@nestjs/swagger";
import { TransactionType } from "@prisma/client";

// Response Transactions
export class TransactionResponseDto {
    @ApiProperty({ description: 'Transaction ID', example: '223...' })
    id: string;

    @ApiProperty({ description: 'Transaction Type', enum: TransactionType, example: TransactionType.TRANSFER })
    type: TransactionType;

    @ApiProperty({ description: 'Transaction amount', example: 200000, type: 'number', format: 'decimal' })
    amount: number;

    @ApiProperty({ description: 'Source account ID', example: '223...', nullable: true })
    fromAccountId: string | null;

    @ApiProperty({ description: 'Destination account ID', example: '456...', nullable: true })
    toAccountId: string | null;

    @ApiProperty({ description: 'Transaction timestamp', example: '2026-01-02T10:30:00Z'})
    createdAt: Date;
}