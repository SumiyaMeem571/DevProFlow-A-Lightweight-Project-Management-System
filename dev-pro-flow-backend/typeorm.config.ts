import { Project } from 'src/project/entities/project.entity';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/user/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const typeOrmconfig: PostgresConnectionOptions = {
  type: 'postgres',
  database: 'dev-pro-flow',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  entities: [User, Project, Task],
  synchronize: true,
};

export default typeOrmconfig;
