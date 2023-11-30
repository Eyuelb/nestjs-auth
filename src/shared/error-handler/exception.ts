import { HttpException, HttpStatus } from '@nestjs/common';

export class ExceptionError extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super({ message, status }, status);
  }
}
