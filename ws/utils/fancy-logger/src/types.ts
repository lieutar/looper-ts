import type { ChalkInstance } from "chalk";

export type LogLevelType = 'silent' | 'error' | 'warn' | 'info' | 'debug';
export type LoggerConfigType = {
  style: ChalkInstance,
  level: LogLevelType,
  tags: string[];
  showCaller: boolean;
  withTrace: boolean;
};
