import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Process } from "./entities/process.entity";
import { ProcessController } from "./controllers/process.controller";
import { ProcessService } from "./services/process.service";

@Module({
  imports: [TypeOrmModule.forFeature([Process])],
  controllers: [ProcessController],
  providers: [ProcessService],
  exports: [ProcessService],
})
export class ProcessModule { }