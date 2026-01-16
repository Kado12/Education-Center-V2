import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { RefreshToken } from '../auth/entities/refresh-token.entity';
import { Process } from 'src/process/entities/process.entity';
// import { Student } from '../students/entities/student.entity';
// import { Salon } from '../salons/entities/salon.entity';
// import { Sede } from '../sedes/entities/sede.entity';
// import { Turn } from '../turns/entities/turn.entity';
// import { PaymentPlan } from '../payment-plans/entities/payment-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3307),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'education_center_v2'),
        entities: [
          User,
          Role,
          RefreshToken,
          Process,
          // ... otras entidades
        ],
        synchronize: true, // Solo en desarrollo
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule { }