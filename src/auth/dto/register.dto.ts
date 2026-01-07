import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MinLength, Matches, MaxLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ 
        description: 'User email address',
        example: 'user@mail.com',
        type: String,
    })
    @IsEmail({}, { message : 'Email must be a valid email address' })
    email: string;
    
    @ApiProperty({
        description: 'User password (min 8 characters)',
        example: 'passWord123',
        minLength: 8,
        type: String,
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    })
    password: string;
    
    @ApiProperty({ 
        description: 'User full name',
        example: 'Jane Doe',
        required: false,
        type: String,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100, { message: 'Name must not exceed 100 characters' })
    name: string;
}
