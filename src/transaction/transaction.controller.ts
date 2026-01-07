import { Controller, Get, Post, Body, Param, Req, Query, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DepositDto, TransferDto, WithdrawDto } from './dto/transactions.dto';
import { TransactionResponseDto } from './dto/transactions-response.dto';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // Deposit
  @Post('deposit')
  @ApiOperation({
    summary: 'Deposit',
    description: 'Deposit money into an account'
  })
  @ApiBody({
    type: DepositDto,
    examples: {
      deposit: {
        summary: 'Deposit amount',
        value: {
          toAccountID: '223...',
          amount: 500000
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Deposit success',
    type: TransactionResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid deposit data',
    schema: {
      example: {
        statusCode: 400,
        message: ['amount must be a positive number'],
        error: 'Bad Request'
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  deposit(@Req() req, @Body() dto: DepositDto) {
    return this.transactionService.deposit(dto, req.user.userId);
  }

  // Withdraw
  @Post('withdraw')
  @ApiOperation({
    summary: 'Withdraw',
    description: 'Withdraw money from an account'
  })
  @ApiBody({
    type: WithdrawDto,
    examples: {
      withdraw: {
        summary: 'Withdraw amount',
        value: {
          fromAccountId: '9876...',
          amount: 200000
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Withdraw success',
    type: TransactionResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Insufficient balance or invalid data',
    schema: {
      example: {
        statusCode: 400,
        message: 'Insufficient balance',
        error: 'Bad Request'
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  withdraw(@Req() req, @Body() dto: WithdrawDto) {
    return this.transactionService.withdraw(dto, req.user.userId);
  }

  // Transfer
  @Post('transfer')
  @ApiOperation({
    summary: 'Transfer',
    description: 'Transfer money from an account to another account'
  })
  @ApiBody({
    type: TransferDto,
    examples: {
      transfer: {
        summary: 'Transfer amount',
        value: {
          fromAccountId: '9876...',
          toAccountId: '1234...',
          amount: 100000
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Transfer success',
    type: TransactionResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Insufficient balance, same account, or invalid data',
    schema: {
      example: {
        statusCode: 400,
        message: 'Cannot transfer to the same account',
        error: 'Bad Request'
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Source or destination account not found' })
  transfer(@Req() req, @Body() dto:TransferDto) {
    return this.transactionService.transfer(dto, req.user.userId);
  }

  // Account
  @Get('account/:accountId')
  @ApiOperation({ 
    summary: 'Get account transactions',
    description: 'Get transaction history for a specific account (both as sender and receiver)'
  })
  @ApiParam({ 
    name: 'accountId', 
    description: 'Account ID',
    example: '123...'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Number of transactions to return',
    example: 10
  })
  @ApiQuery({ 
    name: 'offset', 
    required: false, 
    description: 'Number of transactions to skip',
    example: 0
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of transactions',
    type: [TransactionResponseDto]
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  findByAccount(@Req() req, @Param('accountId') accountId: string, @Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.transactionService.findByAccount(accountId, req.user.userId, limit, offset);
  }

  // Transaction by ID
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get transaction by ID',
    description: 'Get detailed information of a specific transaction'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Transaction ID (UUID)',
    example: '123...'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Transaction details',
    type: TransactionResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Transaction not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Transaction not found',
        error: 'Not Found'
      }
    }
  })
  findOne(@Req() req, @Param('id') id: string) {
    return this.transactionService.findOne(id, req.user.userId);
  }
}
