import type { StoreApi } from 'zustand';

type GetState<T> = StoreApi<T>['getState'];
type SetState<T> = StoreApi<T>['setState'];

type ConfigFn<T extends object> = (
  set: SetState<T>,
  get: GetState<T>,
  api: StoreApi<T>,
) => T;

interface LoggerOptions {
  name?: string;
  showDiff?: boolean;
  showPerformance?: boolean;
  collapsed?: boolean;
  enabled?: boolean;
  filter?: (actionName: string, state: any) => boolean;
}

const enableLogging = import.meta.env.DEV;

function getActionName(args: any): string {
  if (typeof args === 'function') {
    return 'function';
  }
  if (typeof args === 'object' && args !== null) {
    const keys = Object.keys(args);
    if (keys.length === 1) {
      return `Update ${keys[0]}`;
    }
    return `Update ${keys.length} properties`;
  }
  return 'State Update';
}

function computeStateDiff<T extends object>(
  prev: T,
  next: T,
): {
  added: string[];
  changed: string[];
  removed: string[];
} {
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  const added = nextKeys.filter((key) => !(key in prev));
  const removed = prevKeys.filter((key) => !(key in next));
  const changed = nextKeys.filter(
    (key) => key in prev && prev[key as keyof T] !== next[key as keyof T],
  );

  return { added, changed, removed };
}

// Helper to format performance timing
function formatTiming(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export const logger =
  <T extends object>(config: ConfigFn<T>, options: LoggerOptions = {}) =>
  (set: SetState<T>, get: GetState<T>, api: StoreApi<T>) => {
    const {
      name = 'Store',
      showDiff = true,
      showPerformance = true,
      collapsed = true,
      enabled = true,
      filter,
    } = options;

    return config(
      (args: any) => {
        const shouldLog = enableLogging && enabled;

        if (shouldLog) {
          const actionName = getActionName(args);
          const prevState = get();

          // Apply filter if provided
          if (filter && !filter(actionName, prevState)) {
            set(args);
            return;
          }

          const startTime = showPerformance ? performance.now() : 0;

          const logMethod = collapsed ? console.groupCollapsed : console.group;
          logMethod(
            `%c${name} %c${actionName} %c@ ${new Date().toLocaleTimeString()}`,
            'color: #2196F3; font-weight: bold;',
            'color: #4CAF50; font-weight: bold;',
            'color: #9E9E9E; font-weight: normal;',
          );

          // Log action details
          if (typeof args === 'function') {
            console.log(
              '%caction type:',
              'color: #FF9800; font-weight: bold;',
              'function',
            );
            console.log(
              '%caction    ',
              'color: #03A9F4; font-weight: bold;',
              args,
            );
          } else {
            console.log(
              '%caction:',
              'color: #FF9800; font-weight: bold;',
              args,
            );
          }

          set(args);

          const nextState = get();
          const endTime = showPerformance ? performance.now() : 0;

          if (showDiff) {
            const diff = computeStateDiff(prevState, nextState);
            const hasChanges =
              diff.added.length > 0 ||
              diff.changed.length > 0 ||
              diff.removed.length > 0;

            if (hasChanges) {
              console.log(
                '%cdiff:',
                'color: #E91E63; font-weight: bold;',
                diff,
              );

              if (diff.changed.length > 0) {
                console.log(
                  '%cchanged values:',
                  'color: #9C27B0; font-weight: bold;',
                );
                diff.changed.forEach((key) => {
                  console.log(
                    `  ${key}:`,
                    prevState[key as keyof T],
                    '→',
                    nextState[key as keyof T],
                  );
                });
              }
            } else {
              console.log(
                '%cno state changes',
                'color: #607D8B; font-style: italic;',
              );
            }
          } else {
            console.log(
              '%cprev state:',
              'color: #9E9E9E; font-weight: bold;',
              prevState,
            );
            console.log(
              '%cnext state:',
              'color: #4CAF50; font-weight: bold;',
              nextState,
            );
          }

          if (showPerformance) {
            const duration = endTime - startTime;
            console.log(
              '%cperformance:',
              'color: #795548; font-weight: bold;',
              formatTiming(duration),
            );
          }

          console.groupEnd();
        } else {
          set(args);
        }
      },
      get,
      api,
    );
  };
