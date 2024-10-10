export enum EventType {
  A,
  B,
}

export interface EventInput {
  type: EventType;
  userId: string;
  properties: Record<string, unknown>;
}

export interface IEvent {
  type: EventType;
  userId: string;
  properties: Record<string, unknown>;

  validate(): boolean;
}
