import * as React from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  XCircle,
} from 'lucide-react';

import { cn } from '@/lib/utils';

type AlertType = 'note' | 'tip' | 'important' | 'warning' | 'caution';

interface AlertProps extends React.ComponentProps<'div'> {
  type?: AlertType;
  title?: string;
}

const alertConfig = {
  note: {
    icon: Info,
    className:
      'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100',
    iconClassName: 'text-blue-600 dark:text-blue-400',
    titleClassName: 'text-blue-900 dark:text-blue-100',
  },
  tip: {
    icon: Lightbulb,
    className:
      'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100',
    iconClassName: 'text-green-600 dark:text-green-400',
    titleClassName: 'text-green-900 dark:text-green-100',
  },
  important: {
    icon: CheckCircle,
    className:
      'border-purple-200 bg-purple-50 text-purple-900 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-100',
    iconClassName: 'text-purple-600 dark:text-purple-400',
    titleClassName: 'text-purple-900 dark:text-purple-100',
  },
  warning: {
    icon: AlertTriangle,
    className:
      'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100',
    iconClassName: 'text-yellow-600 dark:text-yellow-400',
    titleClassName: 'text-yellow-900 dark:text-yellow-100',
  },
  caution: {
    icon: XCircle,
    className:
      'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
    iconClassName: 'text-red-600 dark:text-red-400',
    titleClassName: 'text-red-900 dark:text-red-100',
  },
} as const;

function Alert({
  type = 'note',
  title,
  className,
  children,
  ...props
}: AlertProps) {
  const config = alertConfig[type];
  const Icon = config.icon;
  const displayTitle = title || type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div
      className={cn(
        'my-4 rounded-lg border px-4 py-2',
        config.className,
        className,
      )}
      role="alert"
      {...props}
    >
      <div className="flex gap-3">
        <Icon
          className={cn('mt-0.5 h-5 w-5 flex-shrink-0', config.iconClassName)}
        />
        <div className="min-w-0 flex-1">
          <div className={cn('mb-1 font-semibold', config.titleClassName)}>
            {displayTitle}
          </div>
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface BaseAlertProps extends Omit<React.ComponentProps<'div'>, 'type'> {
  title?: string;
}

function Note(props: BaseAlertProps) {
  return <Alert type="note" {...props} />;
}

function Tip(props: BaseAlertProps) {
  return <Alert type="tip" {...props} />;
}

function Important(props: BaseAlertProps) {
  return <Alert type="important" {...props} />;
}

function Warning(props: BaseAlertProps) {
  return <Alert type="warning" {...props} />;
}

function Caution(props: BaseAlertProps) {
  return <Alert type="caution" {...props} />;
}

export {
  Note,
  Tip,
  Important,
  Warning,
  Caution,
  Alert,
  type AlertType,
  type AlertProps,
  type BaseAlertProps,
};
