interface CompanyLogoProps {
  text?: string;
  bgColor?: string;
  imageUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-12 h-12 text-lg rounded-md',
  md: 'w-20 h-20 text-3xl rounded-lg',
  lg: 'w-24 h-24 text-4xl rounded-lg',
};

export const CompanyLogo = ({
  text,
  bgColor,
  imageUrl,
  name,
  size = 'md',
}: CompanyLogoProps) => {
  const cls = sizeMap[size];

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${name} logo`}
        className={`${cls} object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${cls} cursor-pointer flex-shrink-0 flex items-center justify-center font-extrabold text-white tracking-tight`}
      style={{ backgroundColor: bgColor ?? '#1F2A44' }}
      aria-label={`${name} logo`}
    >
      {text || name.charAt(0).toUpperCase()}
    </div>
  );
};
