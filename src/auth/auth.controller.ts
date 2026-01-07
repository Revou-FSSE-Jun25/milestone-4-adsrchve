import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBadRequestResponse, ApiConflictResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginResponseDto, RegisterResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register New User
  @Post('register')
  @ApiOperation({ 
    summary: 'Register new user',
    description: 'Create a new user account. Default role is USER.'
  })
  @ApiBody({
    type: RegisterDto,
    description: 'User registration credentials',
    examples: {
      user: {
        summary: 'User registration',
        value: {
          email: 'user@example.com',
          password: 'password123',
          name: 'Jane Doe'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201,
    type: RegisterResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'email must be a valid email',
          'password must be longer than or equal to 8 characters'
        ],
        error: 'Bad Request'
      }
    }
  })
  @ApiConflictResponse({
    description: 'Email already exist',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email already registered',
        error: 'Conflict'
      }
    }
  })
  register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(dto);
  }

  // Login User
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticate user and receive access token'
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
    examples: {
      user: {
        summary: 'User login',
        value: {
          email: 'user@example.com',
          password: 'passWord123',
        }
      },
      admin: {
        summary: 'Admin login',
        value: {
          email: 'admin@example.com',
          password: 'admin123',
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200,
    type: LoginResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'email must be a valid email',
          'incorrect password'
        ],
        error: 'Bad Request'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid email or password',
        error: 'Unauthorized'
      }
    }
  })
  login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }
}
