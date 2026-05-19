import { cn } from '@/lib/utils';

interface FieldErrorProps {
  message?: string;
  className?: string;
}

export const FieldError = ({ message, className }: FieldErrorProps) => {
  if (!message) return null;
  return (
    <p
      role="alert"
      className={cn('mt-1.5 text-xs font-medium text-red-600', className)}
    >
      {message}
    </p>
  );
};
