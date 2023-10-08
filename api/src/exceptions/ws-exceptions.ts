import { WsException } from '@nestjs/websockets';

type WsExceptionType =
  | 'BadRequest'
  | 'Unauthorized'
  | 'Forbidden'
  | 'NotFound'
  | 'Unknown';

export class WsTypeException extends WsException {
  readonly type: WsExceptionType;

  constructor(type: WsExceptionType, message?: string) {
    const error = { type, message };
    super(error);
    this.type = type;
  }
}

export class wsBadRequestException extends WsTypeException {
  constructor(message?: string) {
    super('BadRequest', message);
  }
}

export class wsUnauthorizedException extends WsTypeException {
  constructor(message?: string) {
    super('Unauthorized', message);
  }
}

export class wsForbiddenException extends WsTypeException {
  constructor(message?: string) {
    super('Forbidden', message);
  }
}

export class wsNotFoundException extends WsTypeException {
  constructor(message?: string) {
    super('NotFound', message);
  }
}

export class wsUnknownException extends WsTypeException {
  constructor(message?: string) {
    super('Unknown', message);
  }
}
