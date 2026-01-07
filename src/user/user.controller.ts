import { UserService } from './user.service';
import { Controller, Get, Body, Patch, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ 
    summary: 'Get all users (Admin only)',
    description: 'Retrieve list of all registered users'
  })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserResponseDto]
  })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiForbiddenResponse({
    description: 'Access denied - Admin only',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden'
      }
    }
  })
  findAll() {
    return this.userService.findAll();
  }


  @Get(':id')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Get user by ID (Admin only)',
    description: 'Get detailed information of a specific user'
  })
  @ApiParam({
    name: 'id',
    description: 'User ID (UUID)',
    example: '123...'
  })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: UserResponseDto
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found'
      }
    }
  })
  @ApiForbiddenResponse({ description: 'Access denied - Admin only' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }


  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ 
    summary: 'Update user (Admin only)',
    description: 'Update user information or change role'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'User ID',
    example: '123...'
  })
  @ApiBody({ 
    type: UpdateUserDto,
    examples: {
      updateRole: {
        summary: 'Change user role to admin',
        value: {
          role: 'ADMIN'
        }
      },
      updateName: {
        summary: 'Update user name',
        value: {
          name: 'Jane Doe Updated'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    type: UserResponseDto
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Access denied - Admin only' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }


  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ 
    summary: 'Delete user (Admin only)',
    description: 'Permanently delete a user account'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'User ID',
    example: '123...'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User deleted successfully',
    schema: {
      example: {
        message: 'User deleted successfully',
        deletedUserId: '123...'
      }
    }
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Access denied - Admin only' })
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
 