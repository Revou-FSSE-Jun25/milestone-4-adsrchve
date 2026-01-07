import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto, AccountResponseDto } from './dto/account.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiParam, ApiNotFoundResponse, ApiForbiddenResponse } from '@nestjs/swagger';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // Create bank account
  @Post()
  @ApiOperation({
    summary: 'Create new account',
    description: 'Create new bank account for the authenticated user'
  })
  @ApiBody({
    type: CreateAccountDto,
    examples: {
      create: {
        summary: 'Create account',
        value: {}
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
    type: AccountResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not authenticated',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized'
      }
    }
  })
  create(@Req() req, @Body() dto: CreateAccountDto) {
    return this.accountService.create(req.user.userId);
  }


  // Get bank account
  @Get()
  @ApiOperation({
    summary: 'Get user account',
    description: 'Get all accounts owned by the authenticated user'
  })
  @ApiResponse({
    status: 200,
    description: 'List of user accounts',
    type: [AccountResponseDto]
  })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
  findAll(@Req() req) {
    return this.accountService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get account by ID',
    description: 'Get detailed information of a specific account'
  })
  @ApiParam({
    name: 'id',
    description: 'Account ID (UUID)',
    example: '123e4567-...'
  })
  @ApiResponse({
    status: 200,
    description: 'Account details',
    type: AccountResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Account not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Account not found',
        error: 'Not Found'
      }
    }
  })
  @ApiForbiddenResponse({
    description: 'Access denied - not account owner',
    schema: {
      example: {
        statusCode: 403,
        message: 'You do not have permission to access this account',
        error: 'Forbidden'
      }
    }
  })
  findOne(@Req() req, @Param('id') id: string) {
    return this.accountService.findOne(req.user.userId, id);
  }
}
