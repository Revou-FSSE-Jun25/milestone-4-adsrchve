import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const userId = req.user.userId;
    return this.prisma.user.findUnique({ where: { id:userId }});
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req, @Body() data: { name?: string; email?: string }) {
    const userId = req.user.userId;
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
