import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DepositDto, WithdrawDto, TransferDto } from './dto/transactions.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { TransactionType } from '@prisma/client';
import { TransactionResponseDto } from './dto/transactions-response.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  // Deposit
  async deposit(dto: DepositDto, userId: string): Promise<TransactionResponseDto> {
    const { toAccountId, amount } = dto;
    const account = await this.prisma.account.findUnique({
      where: { id: toAccountId },
    });

    if (!account) throw new NotFoundException('Account not found');
    if (account.userId !== userId) throw new ForbiddenException('You can only deposit to your own account');
  
    const transaction = await this.prisma.$transaction(async (prisma) => {
      const tx = await prisma.transaction.create({
        data: {
          type: TransactionType.DEPOSIT,
          amount,
          fromAccountId: null,
          toAccountId,
        },
      });

      await prisma.account.update({
        where: { id: toAccountId },
        data: {
          balance: { increment: amount },
        },
      });

      return tx;
    });

    return {
      ...transaction,
      amount: transaction.amount.toNumber(),
    };
  }


  // Withdraw
  async withdraw(dto: WithdrawDto, userId: string): Promise<TransactionResponseDto> {
    const { fromAccountId, amount } = dto;
    const account = await this.prisma.account.findUnique({
      where: { id: fromAccountId },
    });

    if (!account) throw new NotFoundException('Account not found');
    if (account.userId !== userId) throw new ForbiddenException('You can only withdraw from your own account');
    if (account.balance.toNumber() < amount) throw new BadRequestException('Insufficient Balance');

    const transaction = await this.prisma.$transaction(async (prisma) => {
      const tx = await prisma.transaction.create({
        data: {
          type: TransactionType.WITHDRAW,
          amount,
          fromAccountId,
          toAccountId: null,
        },
      });

      await prisma.account.update({
        where: { id: fromAccountId },
        data: {
          balance: { decrement: amount },
        },
      });

      return tx;
    });

    return {
      ...transaction,
      amount: transaction.amount.toNumber(),
    };
  }

  // Transfer
  async transfer(dto: TransferDto, userId: string): Promise<TransactionResponseDto> {
    const { fromAccountId, toAccountId, amount } = dto;

    if (fromAccountId === toAccountId) throw new BadRequestException('Cannot transfer to the same account');
    
    const fromAccount = await this.prisma.account.findUnique({
      where: { id: fromAccountId },
    });

    if (!fromAccount) throw new NotFoundException('Source account not found');
    if (fromAccount.userId !== userId) throw new ForbiddenException('You can only transfer from your own account');
    if (fromAccount.balance.toNumber() < amount) throw new BadRequestException('Insufficient balance');
    
    const toAccount = await this.prisma.account.findUnique({
      where: { id: toAccountId },
    });

    if (!toAccount) throw new NotFoundException('Destination account not found');

    const transaction = await this.prisma.$transaction(async (prisma) => {
      const tx = await prisma.transaction.create({
        data: {
          type: TransactionType.TRANSFER,
          amount,
          fromAccountId,
          toAccountId,
        },
      });

      await prisma.account.update({
        where: { id: fromAccountId },
        data: {
          balance: { decrement: amount },
        },
      });

      await prisma.account.update({
        where: { id: toAccountId },
        data: {
          balance: { increment: amount },
        },
      });

      return tx;
    });

    return {
      ...transaction,
      amount: transaction.amount.toNumber(),
    };
  }

  // Transaction History
  async findByAccount(accountId: string, userId: string, limit: number = 10, offset: number = 0): Promise<TransactionResponseDto[]> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new NotFoundException('Account not found');
    if (account.userId !== userId) throw new ForbiddenException('You can only view transactions of your own account');

    const transactions = await this.prisma.transaction.findMany({
      where: {
        OR: [
          { fromAccountId: accountId },
          { toAccountId: accountId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return transactions.map(tx => ({
      ...tx,
      amount: tx.amount.toNumber(),
    }));
  }

  // Transaction by ID
  async findOne(id: string, userId: string): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        fromAccount: true,
        toAccount: true,
      },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    const ownsFromAccount = transaction.fromAccount?.userId === userId;
    const ownsToAccount = transaction.toAccount?.userId === userId;

    if (!ownsFromAccount && !ownsToAccount) throw new ForbiddenException('You do not have permission to view this transaction');

    return {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount.toNumber(),
      fromAccountId: transaction.fromAccountId,
      toAccountId: transaction.toAccountId,
      createdAt: transaction.createdAt,
    };
  }
}