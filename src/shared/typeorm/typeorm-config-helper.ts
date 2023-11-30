import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigHelper } from '../constants/constants';


export const dataSourceOptions = {
  type: 'postgres',
  host: TypeOrmConfigHelper.DATABASE_HOST,
  port: Number(TypeOrmConfigHelper.DATABASE_PORT),
  database: TypeOrmConfigHelper.DATABASE_NAME,
  username: TypeOrmConfigHelper.DATABASE_USER,
  password: TypeOrmConfigHelper.DATABASE_PASSWORD,
  entities: ['dist/**/*.entity.{ts,js}'],
  // migrations: ['dist/migrations/*.{ts,js}'],
  // migrationsRun: true,
  // cli: {
  //   migrationsDir: 'src/migrations',
  // },
  // migrationsTableName: 'typeorm_migrations',
  // // logger: 'advanced-console',
  // // logging: 'all',
  synchronize: TypeOrmConfigHelper.NODE_ENV != 'production', 
  autoLoadEntities: TypeOrmConfigHelper.NODE_ENV != 'production',
} as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
