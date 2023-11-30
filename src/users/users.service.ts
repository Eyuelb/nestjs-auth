import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/users.entity';
import * as bcrypt from 'bcrypt';
import { ExceptionError } from 'src/shared/error-handler/exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = new User();
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);
      user.name = createUserDto.name;
      user.username = createUserDto.username;
      user.email = createUserDto.email;
      user.password = hashPassword;
      user.role = createUserDto.role;
      const newUser = await this.userRepository.save(user);
      return newUser;
    } catch (error) {
      console.error(error);

      if (error.code === '23505' && error.constraint === 'UQ_e12875dfb3b1d92d7d7c5377e22') {
        throw new HttpException(
          'Email already exists',
          HttpStatus.CONFLICT,
        );
      }
      if (error.code === '23505' && error.constraint === 'UQ_78a916df40e02a9deb1c4b75edb') {
        throw new HttpException(
          'Username already exists',
          HttpStatus.CONFLICT,
        );
      }
      
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(email: string, password: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new ExceptionError('User not found', HttpStatus.NOT_FOUND);
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new ExceptionError('Invalid password', HttpStatus.UNAUTHORIZED);
      }

      return user;
    } catch (error) {
      if (error instanceof ExceptionError) {
        throw error;
      }

      throw new ExceptionError(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
