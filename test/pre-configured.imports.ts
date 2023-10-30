import { ConfigModule } from "@nestjs/config";
import workerConfig from "../src/lib/modules/worker/worker.config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MAIN_SERVICE } from "../src/constants";
import { mainEntities } from "./helpers";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Job } from "../src/lib/modules/queue/entities/job.entity";

export const testConfigImport = ConfigModule.forRoot({ 
  ignoreEnvVars: false,
  load: [workerConfig]
});

export const testClientModuleImportMain = ClientsModule.register([
  {
    name: MAIN_SERVICE,
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3000,
    }
  }
]);

export const testClientModuleImportWorker = ClientsModule.register([
  {
    name: MAIN_SERVICE,
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3100,
    }
  }
]);

export const testTypeOrmImportMain = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: ':memory:',
  entities: mainEntities,
  synchronize: true,
});

export const testTypeOrmImportQueue =TypeOrmModule.forRoot({
  name: 'queue',
  type: 'sqlite',
  database: 'cholloq.db',
  entities: [
    Job
  ],
  synchronize: true,
});
