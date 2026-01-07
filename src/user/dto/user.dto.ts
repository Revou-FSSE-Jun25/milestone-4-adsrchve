import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { Role } from "@prisma/client";

export class UpdateUserDto {
    @ApiProperty({ description: 'Username', example: 'Jane Doe', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(100, { message: 'Name must not exceed 100 characters' })
    name?: string;

    @ApiProperty({ description: 'User role', enum: Role, example: Role.ADMIN, required: false })
    @IsOptional()
    @IsEnum(Role, { message: 'Role must be either USER or ADMIN' })
    role?: Role;
}

export class UserResponseDto {
    @ApiProperty({ description: 'User ID', example: '123...' })
    id: string;

    @ApiProperty({ description: 'User email', example: 'user@mail.com' })
    email: string;

    @ApiProperty({ description: 'User name', example: 'Jane Doe' })
    name: string;

    @ApiProperty({ description: 'User role', enum: Role, example: Role.USER })
    role: Role;

    @ApiProperty({ description: 'Account creation timestamp', example: '2026-01-06T10:30:00Z' })
    createdAt: Date;
}