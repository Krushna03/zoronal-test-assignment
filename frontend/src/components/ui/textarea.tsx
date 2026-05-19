import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-invalid={error || undefined}
        className={cn(
          'flex min-h-[90px] w-full rounded-md border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50',
          error &&
            'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
