import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Sede } from "./entities/sede.entity";
import { SedeController } from "./controllers/sedes.controller";
import { SedeService } from "./services/sedes.service";

@Module({
  imports: [TypeOrmModule.forFeature([Sede])],
  controllers: [SedeController],
  providers: [SedeService],
  exports: [SedeService],
})
export class SedeModule { }
