import { IsNotEmpty } from "class-validator";

export class CreateAccountDto {
    @IsNotEmpty()
    accountNumber: string;
}
