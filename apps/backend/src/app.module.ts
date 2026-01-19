import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProcessModule } from './process/process.module';
import { TurnsModule } from './turns/turns.module';
import { SedeModule } from './sedes/sedes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProcessModule,
    TurnsModule,
    SedeModule,
  ],
})
export class AppModule { }