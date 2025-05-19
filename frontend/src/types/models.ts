export interface BotNode {
  id: string;
  type: string;
  content: string;
  position?: {
    x: number;
    y: number;
  };
}

export interface BotEdge {
  source: string;
  target: string;
}

export interface GetBotResponse {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  nodes: BotNode[];
  edges: BotEdge[];
}

export interface BotListItem {
  id: string;
  name: string;
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export type GetBotsResponse = BotListItem[];

export interface CreateBotRequest {
  name: string;
}

export interface CreateBotResponse {
  message: string;
  bot_id: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  access_token: string;
  token_type: string;
}
