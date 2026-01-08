import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Not, Repository } from "typeorm";
import { hash } from "bcrypt";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import { CreateUserDto } from "../dto/create/create-user.dto";
import { UpdateUserDto } from "../dto/update/update-user.dto";
import { UpdatePasswordDto } from "../dto/update/update-password.dto";
import { UserResponseDto } from "../dto/response/user-response.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  async findAll(page: number = 1, limit: number = 10, search?: string, isActive?: boolean): Promise<{
    users: UserResponseDto[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const whereConditions: any = {};

    if (search) {
      whereConditions.username = ILike(`%${search}%`);
    }

    if (isActive !== undefined) {
      whereConditions.isActive = isActive;
    }

    const [users, total] = await this.userRepository.findAndCount({
      where: whereConditions,
      relations: ['role'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const userDtos = users.map(user => this.toResponseDto(user));

    return {
      users: userDtos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.toResponseDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Verificar si el username ya existe
    const existingUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUsername) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    // Verificar si el email ya existe
    const existingEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('El email ya está en uso');
    }

    // Verificar que el rol existe
    const role = await this.roleRepository.findOne({
      where: { id: createUserDto.roleId },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Hash de la contraseña
    const hashedPassword = await hash(createUserDto.password, 12);

    // Crear usuario
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      isActive: true,
    });

    // Guardar usuario
    const savedUser = await this.userRepository.save(user);

    // 🔧 Cargar la relación role después de guardar
    const userWithRole = await this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ['role'],
    });

    if (!userWithRole) {
      throw new Error('Error al crear usuario');
    }

    return this.toResponseDto(userWithRole);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si el nuevo username ya existe (si se está actualizando)
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUsername = await this.userRepository.findOne({
        where: { username: updateUserDto.username, id: Not(id) },
      });

      if (existingUsername) {
        throw new ConflictException('El nombre de usuario ya está en uso');
      }
    }

    // Verificar si el nuevo email ya existe (si se está actualizando)
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email, id: Not(id) },
      });

      if (existingEmail) {
        throw new ConflictException('El email ya está en uso');
      }
    }

    // Actualizar campos
    Object.assign(user, updateUserDto);

    const updatedUser = await this.userRepository.save(user);
    return this.toResponseDto(updatedUser);
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const { compare } = await import('bcrypt');
    const isCurrentPasswordValid = await compare(updatePasswordDto.currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    const hashedPassword = await hash(updatePasswordDto.newPassword, 12);
    user.password = hashedPassword;

    await this.userRepository.save(user);
  }

  async toggleStatus(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // No permitir desactivar el único admin
    if (user.role.name === 'admin') {
      const adminCount = await this.userRepository.count({
        where: { role: { name: 'admin' }, isActive: true },
      });

      if (adminCount <= 1 && user.isActive) {
        throw new BadRequestException('No se puede desactivar el único administrador');
      }
    }

    user.isActive = !user.isActive;
    const updatedUser = await this.userRepository.save(user);

    return this.toResponseDto(updatedUser);
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // No permitir eliminar el único admin
    if (user.role.name === 'admin') {
      const adminCount = await this.userRepository.count({
        where: { role: { name: 'admin' } },
      });

      if (adminCount <= 1) {
        throw new BadRequestException('No se puede eliminar el único administrador');
      }
    }

    await this.userRepository.remove(user);
  }

  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}