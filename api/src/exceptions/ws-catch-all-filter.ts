import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SocketWithAuth } from 'src/types';
import {
  wsBadRequestException,
  wsNotFoundException,
  wsUnknownException,
} from './ws-exceptions';

@Catch()
export class WsCatchAllFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const socket: SocketWithAuth = host.switchToWs().getClient();

    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse();
      const wsException = new wsBadRequestException(
        exceptionResponse['message'] ?? exceptionResponse ?? exception.name,
      );

      socket.emit('exception', wsException.getError());
      return;
    }

    if (exception instanceof NotFoundException) {
      const exceptionResponse = exception.getResponse();
      const wsException = new wsNotFoundException(
        exceptionResponse['message'] ?? exceptionResponse ?? exception.name,
      );

      socket.emit('exception', wsException.getError());
      return;
    }

    // TODO all others exceptions

    const wsException = new wsUnknownException(exception.message);
    socket.emit('exception', wsException.getError());
  }
}
