import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountResponseDto } from './dto/account.dto';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  // Create new account
  async create(userId: string): Promise<AccountResponseDto> {
    const accountNumber = await this.generateAccountNumber();
    const account = await this.prisma.account.create({
      data: { userId, accountNumber },
    });

    return {
      ...account,
      balance: account.balance.toNumber(),
    }
  }

  // Find all account
  async findAll(userId: string): Promise<AccountResponseDto[]> {
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return accounts.map(account => ({
      ...account,
      balance: account.balance.toNumber(),
    }));
  }

  // Find account by ID
  async findOne(userId: string, id: string): Promise<AccountResponseDto> {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) throw new NotFoundException('Account not found');
    if (account.userId !== userId) throw new ForbiddenException('You do not have permission to access this account')

    return {
      ...account,
      balance: account.balance.toNumber(),
    };
  }

  // Generate account number
  private async generateAccountNumber(): Promise<string> {
    let accountNumber = '';
    let isUnique = false;

    while (!isUnique) {
      accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

      const existing = await this.prisma.account.findUnique({
        where: { accountNumber },
      });

      if (!existing) { isUnique = true }
    }

    return accountNumber;
  }

  // Update account balance
  async updateBalance(accountId: string, amount: number): Promise<void> {
    await this.prisma.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
  }

  // Get account balance
  async getBalance(accountId: string): Promise<number> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: { balance: true },
    });

    if (!account) throw new NotFoundException('Account not found');

    return account.balance.toNumber();
  }
}