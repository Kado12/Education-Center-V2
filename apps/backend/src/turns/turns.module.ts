import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TurnsController } from "./controllers/turns.controller";
import { TurnsService } from "./services/turns.service";
import { Turn } from "./entities/turn.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Turn])],
  controllers: [TurnsController],
  providers: [TurnsService],
  exports: [TurnsService],
})
export class TurnsModule { }
