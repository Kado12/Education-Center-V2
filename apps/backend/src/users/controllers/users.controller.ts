import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create/create-user.dto';
import { UpdateUserDto } from '../dto/update/update-user.dto';
import { UpdatePasswordDto } from '../dto/update/update-password.dto';
import { UserResponseDto } from '../dto/response/user-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { RoleResponseDto } from '../dto/response/role-response.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Obtener lista de usuarios' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('isActive') isActiveParam?: string, // Recibir como string primero
  ) {
    // 🔧 Convertir string a boolean correctamente
    let isActive: boolean | undefined;
    if (isActiveParam !== undefined && isActiveParam !== '') {
      isActive = isActiveParam === 'true';
    }

    return this.usersService.findAll(page, limit, search, isActive);
  }

  @Get('/roles')
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Obtener lista de roles' })
  @ApiResponse({ status: 200, description: 'Lista de roles', type: [RoleResponseDto] })
  async getRoles(): Promise<RoleResponseDto[]> {
    const roles = await this.usersService.getAllRoles();
    return roles.map(role => ({
      id: role.id,
      name: role.name,
      permissions: role.permissions || undefined,
    }));
  }

  @Get(':id')
  @Roles('admin', 'secretary')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'Conflicto - usuario o email ya existe' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar usuario' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Put(':id/password')
  @ApiOperation({ summary: 'Actualizar contraseña del usuario' })
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() user: JwtPayload,
  ) {
    // Solo el mismo usuario o admin puede cambiar contraseña
    if (user.sub !== id && user.role !== 'admin') {
      throw new ForbiddenException('No tienes permiso para cambiar esta contraseña');
    }

    await this.usersService.updatePassword(id, updatePasswordDto);
    return { message: 'Contraseña actualizada exitosamente' };
  }

  @Patch(':id/toggle-status')
  @Roles('admin')
  @ApiOperation({ summary: 'Activar o desactivar usuario' })
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.toggleStatus(id);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar usuario' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.delete(id);
    return { message: 'Usuario eliminado exitosamente' };
  }

}