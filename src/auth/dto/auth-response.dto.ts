import { ApiProperty } from '@nestjs/swagger';

// Info User
export class UserInfoDto {
    @ApiProperty({ description: 'User ID', example: '1' })
    id: string;
    
    @ApiProperty({ description: 'User email', example: 'user@mail.com' })
    email: string;
    
    @ApiProperty({ description: 'Username', example: 'Jane Doe' })
    name: string;
    
    @ApiProperty({ description: 'User role', example: 'USER', enum: ['USER', 'ADMIN'] })
    role: string;
}

// Register Response
export class RegisterResponseDto extends UserInfoDto {
    @ApiProperty({ description: 'Account creation timestamp', example: '2026-01-01T10:30:00Z', type: String, format: 'date-time' })
    createdAt: Date;
}

// Login Response
export class LoginResponseDto {
    @ApiProperty({ description: 'JWT Access Token', example: '[JWT TOKEN]' })
    accessToken: string;
    
    @ApiProperty({ description: 'Authenticated user information', type: () => UserInfoDto })
    user: UserInfoDto;
}