import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../users/entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { jwtConstants } from '../constants/auth.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<User | null> {
    console.log('🔍 Validando usuario:', email);
    console.log('🔍 Password recibido:', password);
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    console.log('🔍 Usuario encontrado:', user);
    console.log('🔍 Usuario activo:', user?.isActive);

    if (user) {
      console.log('🔍 Verificando password...');
      const isPasswordValid = await compare(password, user.password);
      console.log('🔍 Password válido:', isPasswordValid);

      if (isPasswordValid) {
        console.log('✅ Usuario validado correctamente');
        return user;
      }
    }

    console.log('❌ Usuario o password inválido');
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Validar usuario
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    // Generar tokens
    const tokens = await this.generateTokens(user);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role.name,
      },
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponseDto> {
    // Verificar refresh token
    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user', 'user.role'],
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    const user = tokenRecord.user;

    // Eliminar token usado
    await this.refreshTokenRepository.remove(tokenRecord);

    // Generar nuevos tokens
    const tokens = await this.generateTokens(user);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role.name,
      },
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token: refreshToken });
  }

  async logoutAll(userId: number): Promise<void> {
    await this.refreshTokenRepository.delete({ userId });
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    // Generar access token
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.accessSecret,
      expiresIn: jwtConstants.accessExpiresIn as any,
    });

    // Generar refresh token
    const refreshToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

    // Guardar refresh token en BD
    const tokenRecord = this.refreshTokenRepository.create({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });
    await this.refreshTokenRepository.save(tokenRecord);

    return { accessToken, refreshToken };
  }

  // Método para crear usuarios (solo admin)
  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    roleId: number;
  }): Promise<User> {
    const { username, email, password, roleId } = userData;

    // Verificar si existe
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Crear usuario
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      roleId,
      isActive: true,
    });

    return await this.userRepository.save(user);
  }
}
