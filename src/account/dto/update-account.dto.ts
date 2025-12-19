import { IsNumber, IsOptional } from 'class-validator';

export class UpdateAccountDto {
    @IsOptional()
    @IsNumber()
    balance?: number;
}
