import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ 
        description: 'User email address',
        example: 'user@mail.com',
        type: String,
    })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;
    
    @ApiProperty({
        description: 'User password',
        example: 'passWord123',
        type: String,
    })
    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}