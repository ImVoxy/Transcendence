import { Request } from 'express';
import { Socket } from 'socket.io';
import { User } from '@prisma/client';

type AuthPayload = {
  id: string;
  id42: string;
  tFA_enabled: boolean;
};

export type RequestWithAuth = Request & AuthPayload;

export type RequestWithUser = Request & { user: User };

export type SocketWithAuth = Socket & AuthPayload;
