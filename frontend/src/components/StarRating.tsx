interface StarRatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
};

const Star = ({
  fill,
  className,
  onClick,
}: {
  fill: 'full' | 'half' | 'empty';
  className: string;
  onClick?: () => void;
}) => {
  const colors =
    fill === 'empty' ? 'text-ink-300' : 'text-star';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`${colors} ${className} ${onClick ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
      aria-hidden={!onClick}
    >
      {fill === 'half' ? (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#E2E8F0" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-grad)"
            d="M12 2l3 6.5L22 9.3l-5 4.7 1.2 7L12 17.8 5.8 21 7 14l-5-4.7 7-.8z"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
          <path d="M12 2l3 6.5L22 9.3l-5 4.7 1.2 7L12 17.8 5.8 21 7 14l-5-4.7 7-.8z" />
        </svg>
      )}
    </button>
  );
};

export const StarRating = ({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onChange,
}: StarRatingProps) => {
  const sizeClass = sizeMap[size];

  const renderStar = (i: number) => {
    const filled = value >= i + 1;
    const half = !filled && value >= i + 0.5;
    const fill: 'full' | 'half' | 'empty' = filled
      ? 'full'
      : half
        ? 'half'
        : 'empty';

    return (
      <Star
        key={i}
        fill={fill}
        className={sizeClass}
        onClick={interactive && onChange ? () => onChange(i + 1) : undefined}
      />
    );
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      {showValue && (
        <span className="font-semibold text-sm text-ink-900 mr-1">
          {value.toFixed(1)}
        </span>
      )}
      <div className="inline-flex items-center gap-0.5">
        {Array.from({ length: max }, (_, i) => renderStar(i))}
      </div>
    </div>
  );
};
