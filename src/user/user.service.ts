import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => ({
      ...user,
      role: user.role as any,
    }));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      ...user,
      role: user.role as any,
    };
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) throw new NotFoundException('User not found');

    // Update user
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.role && { role: dto.role }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      ...user,
      role: user.role as any,
    };
  }

  async delete(id: string): Promise<{ message: string; deletedUserId: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: 'User deleted successfully',
      deletedUserId: id,
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
