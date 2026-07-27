import type { IconVariant, IconProps } from '../types/icons.types';

const defaultClassName = 'w-6 h-6';

// Home Icon
export const HomeIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M10.5 3.75H5.625a1.875 1.875 0 0 0-1.875 1.875V20.25a1.875 1.875 0 0 0 1.875 1.875h12.75a1.875 1.875 0 0 0 1.875-1.875V5.625a1.875 1.875 0 0 0-1.875-1.875H13.5m-3 0V3m0 .75H9m1.5 0h1.5m-9 6.75h12m-12 4.5h12" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
};

// Cube Icon
export const CubeIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"></path>
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"></path>
    </svg>
  );
};

// Check Icon
export const CheckIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
};

// X Mark Icon
export const XMarkIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

// Eye Icon
export const EyeIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
};

// Eye Slash Icon
export const EyeSlashIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.996 0 1.956-.11 2.895-.327m4.326-3.494a11.952 11.952 0 0 0 3.464-5.192c-1.292-4.338-5.31-7.5-10.066-7.5-.996 0-1.956.11-2.895.327m0 0a11.966 11.966 0 0 0-4.576 3.84m4.576-3.84a11.966 11.966 0 0 1 4.576 3.84M6.502 16.503a3 3 0 1 1 4.243-4.243m-4.243 4.243L3.75 19.75" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
};

// Pencil Icon
export const PencilIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
        <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  );
};

// Play Icon
export const PlayIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 5.653c0-.856.917-1.398 1.591-.784l12 9c.54.406.54 1.358 0 1.764l-12 9c-.674.614-1.591.07-1.591-.784V5.653z"
      />
    </svg>
  );
};

// Plus Icon
export const PlusIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M5.25 11.25a.75.75 0 0 0 0 1.5h6.75v6.75a.75.75 0 0 0 1.5 0v-6.75h6.75a.75.75 0 0 0 0-1.5h-6.75V4.5a.75.75 0 0 0-1.5 0v6.75H5.25Z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};

// Minus Icon
export const MinusIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M3.75 11.25a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5H3.75Z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </svg>
  );
};

// Arrow Up Icon
export const ArrowUpIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M7 14l5-5 5 5z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
      />
    </svg>
  );
};

// Arrow Down Icon
export const ArrowDownIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M7 10l5 5 5-5z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
      />
    </svg>
  );
};

// Arrow Left Icon
export const ArrowLeftIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5L8.25 12l7.5-7.5"
      />
    </svg>
  );
};

// Arrow Right Icon
export const ArrowRightIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5L15.75 12l-7.5 7.5"
      />
    </svg>
  );
};

// Arrow Right Icon
export const ArrowLongRightIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
        ></path>
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
      ></path>
    </svg>
  );
};

// User Icon
export const UserIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
};

// Check Circle Icon
export const CheckCircleIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

// X Circle Icon
export const XCircleIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.3 10.3l-1.3 1.3L13.3 15l1.3 1.3-1.3 1.3L12 16.3l-1.3 1.3-1.3-1.3L10.7 15 9.4 13.7l1.3-1.3L10.7 11l-1.3-1.3 1.3-1.3L12 10.3l1.3-1.3 1.3 1.3L13.3 11l1.3 1.3z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

// Exclamation Circle Icon
export const ExclamationCircleIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
      />
    </svg>
  );
};

// Chart Bar Icon
export const ChartBarIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75zM9.75 6.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v13.5c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V6.875zm6-4.5c-.621 0-1.125.504-1.125 1.125v15.75c0 .621.504 1.125 1.125 1.125h2.25a1.125 1.125 0 0 0 1.125-1.125V3.375c0-.621-.504-1.125-1.125-1.125h-2.25z"
      />
    </svg>
  );
};

// Heart Icon
export const HeartIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      />
    </svg>
  );
};

// Cloud Arrow Up Icon
export const CloudArrowUpIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM16 16v-3.5h-3v3.5h-3l4 4 4-4h-2z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.6 4.6 0 0 1-.88-9.1A5 5 0 1 1 15.9 6L16 6a5 5 0 1 1 .9 9.9m-5 5v-5m0 0L9.7 10.7M12 16l2.3-2.3"
      />
    </svg>
  );
};

// Common additional icons
export const CpuChipIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.75 7.5A2.25 2.25 0 0 1 8 5.25h8a2.25 2.25 0 0 1 2.25 2.25v8a2.25 2.25 0 0 1-2.25 2.25H8A2.25 2.25 0 0 1 5.75 15V7.5Z"
    />
  </svg>
);

export const BuildingLibraryIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
    />
  </svg>
);

export const FolderIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z"
    />
  </svg>
);

export const DocumentIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    ></path>
  </svg>
);

export const DocumentTextIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 8h10M7 12h10m-7 4h7M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4l-2-2z"
    />
  </svg>
);

export const DocumentCheckIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
    />
  </svg>
);

export const DocumentDuplicateIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.185 0-2.25 1.065-2.25 2.25v5.338a2.25 2.25 0 0 0 .375 1.322l1.968 2.332c.494.583.745 1.379.745 2.191V17.5a2.25 2.25 0 0 0 2.25 2.25h5a2.25 2.25 0 0 0 2.25-2.25v-1.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 1-.75.75h-5a.75.75 0 0 1-.75-.75V9.991a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 0 1.5 0V4.5c0-.647-.146-1.262-.406-1.812z"
    />
  </svg>
);

export const TagIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.402.402.937.629 1.531.629a2.16 2.16 0 0 0 1.532-.629l7.04-7.04a2.16 2.16 0 0 0 .628-1.532c0-.595-.227-1.129-.628-1.531l-9.58-9.581a2.25 2.25 0 0 0-1.592-.659H9.568z"
    />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zM14.25 15h.008v.008H14.25V15zm0 2.25h.008v.008H14.25v-.008zM16.5 15h.008v.008H16.5V15zm0 2.25h.008v.008H16.5v-.008z"
    />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

export const LinkIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.039l1.758-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
    />
  </svg>
);

export const RocketLaunchIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
  variant = 'outline',
}) => {
  if (variant === 'solid') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={width}
        height={height}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
        />{' '}
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
      />
    </svg>
  );
};

export const MagnifyingGlassIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.5 5.5a7.5 7.5 0 0 0 10.5 10.5z"
    />
  </svg>
);

export const FunnelIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

export const InformationCircleIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.008v.008H12V8.25z"
    />
  </svg>
);

export const ExclamationTriangleIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
    ></path>
  </svg>
);

export const ArrowPathIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
    />
  </svg>
);

export const CogIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    ></path>
  </svg>
);

export const Cog6ToothIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    ></path>
  </svg>
);

export const ListBulletIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.625 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm0 0H8.25m4.125 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm0 0H12.25m4.125 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
    />
  </svg>
);

export const ClipboardIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
    ></path>
  </svg>
);

export const ClipboardDocumentCheckIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.35 3.836c-.655.355-1.08.852-1.358 1.446-.201.416-.348.665-.518.923a2.712 2.712 0 0 0-.5 1.703c0 .462.1.946.348 1.384.245.531.645 1.046 1.28 1.696a.75.75 0 0 0 1.067-.03c.635-.64 1.035-1.165 1.28-1.696.248-.438.348-.922.348-1.384a2.712 2.712 0 0 0-.5-1.703c-.17-.258-.317-.507-.518-.923-.278-.594-.703-1.091-1.358-1.446m0 0C9.806 2.94 10.923 2.5 12 2.5c1.077 0 2.194.44 3.15 1.336m-1.8 0c.068.087.137.176.207.266.343.417.682.83 1.013 1.296.31.426.629.846 1.013 1.296a.75.75 0 0 0-.584 1.28 60.461 60.461 0 0 1-2.694-.449.75.75 0 0 0-.606.073c-.223.145-.456.366-.656.732a2.75 2.75 0 0 0-.426-1.26c0-.45.09-.88.258-1.28H9m0 0c.068.087.137.176.207.266.343.417.682.83 1.013 1.296.31.426.629.846 1.013 1.296M6.75 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm12 0a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"
    />
  </svg>
);

export const Squares2X2Icon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.375 19.5h17.25m-17.25-4.5h17.25m-17.25-4.5h17.25m-17.25-4.5h17.25"
    />
  </svg>
);

export const BeakerIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5.432 15.3a9.01 9.01 0 0 0-2.02 3.991v2.084a2.25 2.25 0 0 0 2.25 2.25h13.636a2.25 2.25 0 0 0 2.25-2.25v-2.084a9.01 9.01 0 0 0-2.02-3.991l-3.659-4.591A2.25 2.25 0 0 1 14.25 8.818v-5.714m0 0L9.75 3.104M14.25 3.104l4.5 0v5.714a2.25 2.25 0 0 1-.659 1.591L18.568 15.3"
    />
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 6.75v10.5a.75.75 0 0 1-1.5 0V6.75m0 0a.75.75 0 0 1 1.5 0zm12 0v10.5a.75.75 0 0 1-1.5 0V6.75m0 0a.75.75 0 0 1 1.5 0z"
    />
  </svg>
);

export const StopIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9z"
    />
  </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75m-3-7.036A9.721 9.721 0 0 1 12 3c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7z"
    />
  </svg>
);

export const MagnifyingGlassPlusIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.5 5.5a7.5 7.5 0 0 0 10.5 10.5zm-6-3.75h.008v.008H12v-.008zm0 2.25h.008v.008H12v-.008zm0-8.25h.008v.008H12V8.25z"
    />
  </svg>
);

export const MagnifyingGlassMinusIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.5 5.5a7.5 7.5 0 0 0 10.5 10.5zm-3-7.5h-3m0 0H9m0 0v3m0-3v-3"
    />
  </svg>
);

export const ArrowTrendingUpIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6l5.693-3.802a2.25 2.25 0 0 1 2.614 0l5.693 3.802M3 21h18M3.75 3h16.5"
    />
  </svg>
);

export const ArrowTrendingDownIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6l5.693 3.802a2.25 2.25 0 0 0 2.614 0l5.693-3.802M3 21h18M3.75 3h16.5"
    />
  </svg>
);

export const ToothIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.25 11.25L.75.75h11.5V11.25a1.5 1.5 0 1 1-3 0v-8.25a1.5 1.5 0 0 0-1.5-1.5H6a1.5 1.5 0 0 0-1.5 1.5v8.25a1.5 1.5 0 1 1-3 0"
    />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m8.25 4.5 7.5 7.5-7.5 7.5"
    />
  </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
    />
  </svg>
);

export const GithubIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 24,
  height = 24,
  strokeWidth = 1.5,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    width={width}
    height={height}
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

// Bulldog Brand Logo Icon
export const BulldogIcon: React.FC<IconProps> = ({
  className = defaultClassName,
  width = 48,
  height = 48,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 800 800"
    className={className}
    width={width}
    height={height}
  >
    <g>
      <path
        fill="#AF1F2F"
        d="M321.11,357.861c-5.498-1.474-12.709-1.872-21.831,0.524c0,0,2.254,2.543,7.232,2.543c0,0-0.619,13.48,13.117,13.48c13.735,0,15.515-8.012,15.515-8.012s-2.999-4.103-9.559-6.979c-0.533,0.509-0.869,1.224-0.869,2.019c0,1.196,0.754,2.209,1.809,2.609c-0.176,0.366-0.283,0.772-0.283,1.206c0,0.7,0.266,1.332,0.691,1.823c-0.883,0.612-1.951,0.975-3.107,0.975c-3.02,0-5.469-2.448-5.469-5.468C318.355,360.554,319.471,358.805,321.11,357.861z"
      />
      <polygon
        fill="#898888"
        points="250.338,622.865 248.777,628.15 243.875,644.752 243.303,646.686 260.178,623.633"
      />
      <path
        fill="#905345"
        d="M440.575,436.007c0,0-8.673-20.506-40.555-12.067c-31.881-8.439-40.596,12.067-40.596,12.067c13.711-17.732,40.575-9.279,40.575-9.279S426.864,418.275,440.575,436.007z"
      />
      <polygon
        fill="#E2E2E2"
        points="243.699,647.984 243.699,647.985 245.986,647.057 260.482,641.18 268.647,637.868 261.095,624.314"
      />
      <polygon
        fill="#898888"
        points="219.069,568.515 219.069,550.797 203.725,559.656"
      />
      <path
        fill="#905345"
        d="M275.37,272.669c2.898,19.873,31.74,26.855,42.376,28.766c2.574,0.274,3.916,0.609,3.916,0.609s-1.483-0.173-3.916-0.609c-5.663-0.604-17.291-0.914-33.728,3.283c-43.116,11.008-46.292,40.187-36.118,44.257c10.174,4.07,25.435-13.735,60.027-13.735c34.591,0,54.431,22.892,65.113,22.892c10.683,0,10.683-17.805,10.683-17.805c-4.07-25.435-50.871-38.282-50.871-38.282c86.48,18.523,62.402,67.956,39.679,64.904c-10.431-1.401-22.423-7.495-34.449-12.653c0.847,0.788,1.561,1.586,2.147,2.373c6.104,8.203,16.532,13.926,16.532,13.926c-9.665,0-15.261-5.056-15.261-5.056c-2.798,18.854-25.944,21.079-33.065,13.958c-7.122-7.122-21.365-18.313-29.759-16.787c-8.393,1.526-30.521,24.417-32.048,30.267c-1.526,5.85,45.02,51.379,72.999,16.533c27.978-34.846,48.58-35.1,48.58-35.1s-25.435,6.868-40.95,37.135c-15.516,30.268-41.968,37.135-41.968,37.135c-2.677,4.82-10.238,27.044-14.51,39.874c0.832,2.083,1.375,4.276,1.715,6.603c19.141-32.944,44.716-56.652,44.716-56.652c-24.698,32.127-38.36,60.63-42.965,83.231c-1.427,7.372-1.781,15.511-1.781,15.511c-0.198,14.195,4.115,24.992,12.231,31.486c22.044,17.635,59.349-3.052,74.27-24.418c14.922-21.365,30.861-22.722,30.861-22.722s3.392-0.339,3.392-14.949c0-14.61-39.001-18.286-27.131-23.034c11.87-4.748,15.091-5.257,21.365-11.53c6.274-6.274-0.848-30.013-7.46-23.4c-6.613,6.613-3.052,25.435-17.975,16.957c-14.922-8.478-9.156-33.574,4.07-42.391c13.215-8.81,33.876-3.063,33.912-3.053c0.036-0.01,20.698-5.757,33.912,3.053c13.226,8.817,18.991,33.913,4.07,42.391c-14.922,8.478-11.361-10.344-17.975-16.957c-6.613-6.613-13.735,17.126-7.46,23.4c6.274,6.274,9.495,6.783,21.365,11.53c11.869,4.748-27.131,8.423-27.131,23.034c0,14.61,3.392,14.949,3.392,14.949s15.939,1.357,30.861,22.722c14.922,21.365,52.227,42.052,74.27,24.418c8.118-6.493,12.429-17.29,12.231-31.486c0,0-0.493-8.944-1.781-15.511c-4.604-22.601-18.267-51.104-42.965-83.231c0,0,25.575,23.707,44.717,56.652c0.339-2.327,0.882-4.52,1.714-6.603c-4.272-12.83-11.832-35.054-14.51-39.874c0,0-26.453-6.867-41.968-37.135c-15.515-30.268-40.95-37.135-40.95-37.135s20.602,0.254,48.58,35.1c27.979,34.846,74.525-10.683,72.999-16.533c-1.526-5.85-23.655-28.742-32.048-30.267c-8.394-1.526-22.637,9.665-29.759,16.787c-7.121,7.122-30.267,4.896-33.065-13.958c0,0-5.595,5.056-15.261,5.056c0,0,10.428-5.723,16.532-13.926c0.586-0.787,1.301-1.585,2.147-2.373c-12.025,5.158-24.018,11.252-34.449,12.653c-22.723,3.052-46.801-46.381,39.678-64.904c0,0-46.8,12.847-50.87,38.282c0,0,0,17.805,10.683,17.805c10.682,0,30.522-22.892,65.113-22.892c34.592,0,49.853,17.804,60.027,13.735c10.174-4.07,6.998-33.249-36.118-44.257c-16.437-4.197-28.065-3.886-33.728-3.283c10.637-1.911,39.478-8.892,42.376-28.766c0,0,29.505,44.766,52.905,7.122c0,0,3.052-13.226-12.718-41.205c0,0-13.226-134.614-105.47-158.884c0,0,17.126,48.914,2.531,123.627c15.137,10.469,30.195,31.697,30.195,31.697c-17.296-17.296-32.726-19.793-32.726-19.793v0c-0.005-0.007-9.507-13.563-59.345-8.478v0c-0.001,0-0.001,0-0.002,0c0,0-0.001,0-0.002,0v0c-49.838-5.085-59.34,8.472-59.344,8.478l-0.001,0c0,0-15.43,2.497-32.726,19.793c0,0,15.058-21.228,30.195-31.697c-14.595-74.713,2.531-123.627,2.531-123.627c-92.244,24.27-105.47,158.884-105.47,158.884c-15.77,27.979-12.718,41.205-12.718,41.205C245.866,317.435,275.37,272.669,275.37,272.669z M470.877,209.081l22.612-2.544c0,0,14.84-51.542-4.772-78.465c-1.142-1.568-2.381-3.067-3.767-4.453c0,0,1.439,1.658,3.767,4.453c9.549,11.47,34.265,42.365,37.947,59.135c4.579,20.857,4.07,40.696,4.07,40.696s8.139,3.561,8.139-12.717c0,0,8.884,17.709-1.018,21.874c0,0,14.752,19.331,14.752,28.996C552.608,266.056,519.373,223.325,470.877,209.081z M470.877,427.314c0,0-39.337-40.015-70.875-32.557v0.001c-0.001,0-0.001,0-0.001,0c-0.001,0-0.002,0-0.002,0v-0.001c-31.539-7.458-70.876,32.557-70.876,32.557c36.268-55.25,70.842-46.81,70.878-46.801C400.036,380.504,434.609,372.064,470.877,427.314z M482.254,301.435c-2.432,0.437-3.916,0.609-3.916,0.609S479.68,301.709,482.254,301.435z M400.001,298.103c30.521-20.346,67.146-9.664,67.146-9.664c-50.76,0-67.075,29.878-67.145,30.008v0.006l-0.001-0.003l-0.002,0.003v-0.006c-0.07-0.13-16.386-30.008-67.145-30.008C332.853,288.439,369.478,277.757,400.001,298.103z M261.126,215.186c0,16.278,8.139,12.717,8.139,12.717s-0.509-19.839,4.07-40.696c3.681-16.77,28.397-47.664,37.947-59.135c2.327-2.795,3.766-4.453,3.766-4.453c-1.386,1.386-2.624,2.885-3.766,4.453c-19.612,26.923-4.772,78.465-4.772,78.465l22.612,2.544c-48.496,14.244-81.731,56.974-81.731,56.974c0-9.665,14.753-28.996,14.753-28.996C252.243,232.895,261.126,215.186,261.126,215.186z"
      />
      <path
        fill="#AF1F2F"
        d="M478.89,357.861c1.638,0.944,2.755,2.694,2.755,4.721c0,3.02-2.448,5.468-5.469,5.468c-1.156,0-2.224-0.363-3.107-0.975c0.425-0.491,0.691-1.123,0.691-1.823c0-0.434-0.107-0.84-0.283-1.206c1.056-0.4,1.809-1.413,1.809-2.609c0-0.796-0.335-1.51-0.869-2.019c-6.561,2.877-9.559,6.979-9.559,6.979s1.78,8.012,15.515,8.012c13.735,0,13.117-13.48,13.117-13.48c4.977,0,7.231-2.543,7.231-2.543C491.599,355.989,484.388,356.387,478.89,357.861z"
      />
      <path
        fill="#905345"
        d="M431.537,598.237c23.695,11.15,46.528-1.878,50.312-4.223c-6.435-1.308-12.425-4.024-17.415-8.325C434.93,560.255,419.33,529.734,400,529.732c-19.329,0.002-34.93,30.523-64.434,55.957c-4.99,4.302-10.981,7.017-17.415,8.325c3.784,2.344,26.618,15.373,50.312,4.223c0,0,12.207,15.8,31.535,8.919v-0.001c0.001,0,0.002,0,0.002,0c0.001,0,0.001,0,0.002,0v0.001C419.33,614.037,431.537,598.237,431.537,598.237z M400.001,594.946c-0.019,0.001-15.772,0.743-22.891-6.375c-7.122-7.122-15.091,12.24-47.987,6.375c0,0,10.089-3.068,31.709-24.688c21.617-21.617,30.52-33.571,39.167-33.574v0c0.001,0,0.001,0,0.002,0c0,0,0.001,0,0.001,0v0c8.647,0.003,17.549,11.957,39.167,33.574c21.62,21.62,31.709,24.688,31.709,24.688c-32.896,5.866-40.865-13.496-47.987-6.375C415.773,595.689,400.019,594.947,400.001,594.946z"
      />
      <path
        fill="#ED1C24"
        d="M538.766,517.864c1.769,4.331,3.354,8.745,4.686,13.224c9.315,31.331-12.295,54.722-37.027,61.699l0.396-0.092c-35.61,30.013-77.319,17.751-77.319,17.751c-9.657,13.722-29.466,11.704-29.503,11.7c-0.036,0.004-19.846,2.022-29.503-11.7c0,0-40.863,11.874-76.331-17.488c-24.977-6.768-47.006-30.288-37.618-61.87c1.333-4.48,2.918-8.893,4.687-13.224c-1.984-23.438-5.562-30.052-11.053-34.392c-10.822,13.654-17.034,28.948-17.034,45.116c0,3.111,0.271,6.183,0.718,9.225c0.952,6.491,2.9,12.806,5.728,18.901c20.376,43.901,86.646,76.115,159.389,76.115h2.032c72.743,0,139.013-32.213,159.39-76.115c2.828-6.095,4.776-12.41,5.728-18.901c0.446-3.042,0.718-6.114,0.718-9.225c0-16.168-6.212-31.461-17.034-45.116C544.328,487.813,540.749,494.427,538.766,517.864z"
      />
      <path
        fill="#9B1C20"
        d="M401.016,646.861h-2.032c-73.94,0-137.452-29.326-165.118-71.247c-0.251-0.381-0.473-0.771-0.718-1.154v10.38c0,11.546,3.155,22.65,8.895,33.029l1.149-4.288l25.674,1.97l12.778,28.469l-12.611,4.563c26.263,20.815,64.516,35.373,106.564,39.373l-9.504-16.461l32.89-16.156h2.032l32.89,16.156l-9.504,16.461c42.049-4,80.302-18.558,106.566-39.373l-12.612-4.563l12.779-28.469l25.673-1.97l1.149,4.288c5.74-10.379,8.895-21.484,8.895-33.029v-10.38c-0.245,0.383-0.467,0.774-0.718,1.154C538.468,617.535,474.956,646.861,401.016,646.861z"
      />
      <polygon
        fill="#898888"
        points="389.042,688.857 397.264,703.098 398.984,706.078 398.984,669.16 382.379,677.316"
      />
      <polygon
        fill="#E2E2E2"
        points="580.931,568.515 596.275,559.656 580.931,550.797"
      />
      <polygon
        fill="#E2E2E2"
        points="551.222,628.15 549.662,622.865 539.605,623.649 556.851,647.208 556.125,644.752"
      />
      <polygon
        fill="#898888"
        points="531.352,637.868 539.518,641.18 554.013,647.057 555.975,647.853 538.805,624.49"
      />
      <polygon
        fill="#E2E2E2"
        points="401.016,706.078 402.736,703.098 410.958,688.857 417.621,677.316 401.016,669.16"
      />
      <path
        fill="#200E0B"
        d="M317.746,301.435c2.433,0.437,3.916,0.609,3.916,0.609S320.32,301.709,317.746,301.435z"
      />
      <path
        fill="#200E0B"
        d="M311.283,128.073c1.142-1.568,2.381-3.067,3.766-4.453C315.049,123.62,313.61,125.278,311.283,128.073z"
      />
      <path
        fill="#200E0B"
        d="M478.338,302.044c0,0,1.484-0.173,3.916-0.609C479.68,301.709,478.338,302.044,478.338,302.044z"
      />
      <path
        fill="#200E0B"
        d="M488.718,128.073c-2.327-2.795-3.767-4.453-3.767-4.453C486.337,125.006,487.575,126.505,488.718,128.073z"
      />
      <g>
        <path
          fill="#655046"
          d="M280.395,349.791c0,0,10.241-2.098,24.184-2.867C292.132,346.963,280.395,349.791,280.395,349.791z"
        />
        <path
          fill="#5E2A1F"
          d="M508.734,303.106c51.614,9.158,69.165-17.358,43.791-74.497c-6.804-15.323-6.998-33.268-24.755-62.326c-13.608-22.268-37.176-35.84-37.176-35.84s19.238,23.469,14.908,81.614l46.858,52.08c0,0-34.118-34.469-74.105-45.898c0,0,27.265,23.915,8.496,42.684c-18.762,18.763-47.014-3.173-86.793,24.685c-39.779-27.858-68.029-5.922-86.793-24.685c-18.77-18.77,8.496-42.684,8.496-42.684c-39.988,11.429-74.104,45.898-74.104,45.898l46.858-52.08c-4.33-58.145,14.908-81.614,14.908-81.614s-23.568,13.572-37.176,35.84c-17.758,29.058-17.95,47.004-24.755,62.326c-25.374,57.139-7.822,83.655,43.791,74.497c51.613-9.158,90.244,16.581,94.368,38.437c4.123,21.856-18.97,18.97-18.97,18.97c-16.281-13.169-42.697-14.655-62.002-13.59c9.327-0.03,19.053,1.501,24.543,6.991c3.347,3.347,7.417,6.363,11.602,9.005c-2.137,7.35-6.026,17.126-11.602,17.126c-8.934,0-37.182-17.884-37.182-17.884s-14.472-7.923-25.773,3.378c0,0,20,31.468,54.434,24.046c0,0-8.145,12.062-16.289,20.206c-8.144,8.144-33.027,12.592-49.607-5.663c0,0,19.916,30.406,34.555,30.406c14.64,0,27.95-14.639,27.95-14.639s22.772-40.619,50.402-45.155l-0.408-0.323c23.634-5.37,31.953,4.944,32.719,5.99l-0.005,0.079c-0.873-0.311-26.48-9.171-51.379,14.255c-25.333,23.835-55.98,69.692-69.589,76.496c-13.609,6.804-13.299,12.236-13.299,12.236l3.402,19.001l47.939-63.403l12.681-12.681c0,0,39.791-41.301,70.285-45.868c30.493,4.567,70.285,45.868,70.285,45.868l12.681,12.681l47.939,63.403l3.402-19.001c0,0,0.309-5.432-13.299-12.236c-13.608-6.804-44.256-52.661-69.589-76.496c-24.898-23.426-50.506-14.566-51.379-14.255l-0.005-0.079c0.766-1.046,9.085-11.359,32.719-5.99l-0.408,0.323c27.629,4.536,50.402,45.155,50.402,45.155s13.311,14.639,27.95,14.639c14.64,0,34.555-30.406,34.555-30.406c-16.579,18.255-41.462,13.807-49.607,5.663c-8.145-8.144-16.289-20.206-16.289-20.206c34.433,7.423,54.434-24.046,54.434-24.046c-11.301-11.301-25.774-3.378-25.774-3.378s-28.248,17.884-37.182,17.884c-5.576,0-9.465-9.776-11.602-17.126c4.185-2.643,8.255-5.658,11.602-9.005c5.49-5.49,15.216-7.021,24.543-6.991c-19.305-1.065-45.72,0.421-62.002,13.59c0,0-23.093,2.887-18.969-18.97C418.49,319.688,457.12,293.948,508.734,303.106z M399.984,380.49c-0.004,0.001-0.023,0.008-0.025,0.009c-0.002-0.001-0.021-0.008-0.025-0.009c0.003-0.004,0.018-0.025,0.025-0.035C399.966,380.465,399.981,380.486,399.984,380.49z M402.82,335.358l-2.862,44.502l-2.861-44.502c-7.835-33.403-64.244-46.919-64.244-46.919c41.401-8.517,66.194,10.108,67.064,10.775v0.062c0,0,0.038-0.028,0.041-0.031c0.004,0.003,0.042,0.031,0.042,0.031v-0.062c0.87-0.666,25.663-19.292,67.064-10.775C467.064,288.439,410.655,301.955,402.82,335.358z"
        />
        <path
          fill="#655046"
          d="M495.338,346.923c13.944,0.77,24.185,2.867,24.185,2.867S507.786,346.963,495.338,346.923z"
        />
        <path
          fill="#5E2A1F"
          d="M494.677,554.124c-33.215-5.536-55.173-43.157-72.087-49.311c6.084-3.948,13.228-6.439,17.902-9.04c9.631-5.361,1.915-18.557,1.915-18.557c14.021-19.382,3.388-35.806,3.388-35.806l-38.853-8.731c0,0-3.711,49.898-3.711,59.795c0,4.587,1.763,15.661,3.616,24.41c-1.025,4.11,0.384,7.098,2.267,9.156c0.895,2.86,1.605,3.888,1.859,1.669c1.861,1.391,3.597,2.023,3.597,2.023s4.195,4.435,10.707,10.689c-11.363-8.159-20.245-14.313-22.047-14.957c-1.573-0.562-2.597,0.246-3.274,1.685c-0.676-1.439-1.701-2.247-3.273-1.685c-1.804,0.644-10.685,6.798-22.049,14.958c6.512-6.254,10.708-10.69,10.708-10.69s1.737-0.632,3.597-2.023c0.254,2.219,0.964,1.191,1.86-1.67c1.882-2.058,3.292-5.046,2.267-9.156c1.854-8.749,3.617-19.823,3.617-24.41c0-9.897-3.711-59.795-3.711-59.795l-38.854,8.731c0,0-10.632,16.424,3.389,35.806c0,0-7.715,13.196,1.915,18.557c4.674,2.602,11.819,5.092,17.902,9.04c-16.914,6.154-38.871,43.776-72.087,49.312c-35.258,5.876-31.856-41.753-31.856-41.753c-27.836,59.692,15.155,68.97,39.176,68.97c2.64,0,5.59-0.653,8.73-1.762c-5.355,3.982-8.73,6.505-8.73,6.505c9.897,33.403,53.197,15.258,53.197,15.258c4.909,11.864,33.743,7.625,34.201,7.556c0.459,0.068,29.293,4.308,34.202-7.556c0,0,43.3,18.145,53.197-15.258c0,0-3.376-2.522-8.73-6.504c3.14,1.109,6.09,1.762,8.73,1.762c24.021,0,67.011-9.279,39.176-68.97C526.533,512.371,529.935,560.001,494.677,554.124z M406.944,600.104h-6.943h-0.084h-6.943c-9.485,0-36.702-11.547-28.454-24.725c7.314-11.687,30.317-30.84,35.438-35.033c5.122,4.193,28.126,23.346,35.44,35.033C443.645,588.558,416.428,600.104,406.944,600.104z"
        />
      </g>
      <path
        fill="#7A1317"
        d="M248.641,478.041c0,0-30.104,27.217-24.743,56.083c5.361,28.866,45.774,70.929,76.29,82.888c30.516,11.959,91.87,21.856,100.988,21.856c9.117,0,63.964-11.959,83.758-40.001l-28.867,10.024l-24.33-4.664l-30.561,14.021l-33.564-11.547l-40.619-1.237l-36.289-22.268l-30.525-37.114l13.206-39.588L248.641,478.041z"
      />
      <g>
        <path
          fill="#200E0B"
          d="M329.123,209.081l-22.612-2.544c0,0-14.84-51.542,4.772-78.465c-9.55,11.47-34.266,42.365-37.947,59.135c-4.579,20.857-4.07,40.696-4.07,40.696s-8.139,3.561-8.139-12.717c0,0-8.883,17.709,1.018,21.874c0,0-14.753,19.331-14.753,28.996C247.392,266.056,280.627,223.325,329.123,209.081z"
        />
        <path
          fill="#200E0B"
          d="M399.998,318.446v0.006l0.002-0.003l0.001,0.003v-0.006c0.07-0.13,16.385-30.008,67.145-30.008c0,0-36.625-10.682-67.146,9.664c-30.522-20.346-67.147-9.664-67.147-9.664C383.612,288.439,399.928,318.316,399.998,318.446z"
        />
        <path
          fill="#200E0B"
          d="M400.001,380.513c-0.036-0.009-34.609-8.449-70.878,46.801c0,0,39.337-40.015,70.876-32.557v0.001c0.001,0,0.001,0,0.002,0c0,0,0.001,0,0.001,0v-0.001c31.538-7.458,70.875,32.557,70.875,32.557C434.609,372.064,400.036,380.504,400.001,380.513z"
        />
        <path
          fill="#200E0B"
          d="M552.608,266.056c0-9.665-14.752-28.996-14.752-28.996c9.901-4.165,1.018-21.874,1.018-21.874c0,16.278-8.139,12.717-8.139,12.717s0.509-19.839-4.07-40.696c-3.681-16.77-28.397-47.664-37.947-59.135c19.612,26.923,4.772,78.465,4.772,78.465l-22.612,2.544C519.373,223.325,552.608,266.056,552.608,266.056z"
        />
        <path
          fill="#200E0B"
          d="M580.931,528.588c0-19.215-6.993-37.35-19.364-53.392c3.668-3.132,7.791-7.63,12.407-14.987c21.705-34.592,8.139-97.331-2.713-126.497c-10.853-29.166,3.73-27.131,13.226-45.783c9.495-18.652-11.192-47.14-11.192-47.14C545.487,66.137,446.035,70.885,446.035,70.885c21.281,44.087,7.885,128.069,7.885,128.069c-24.741-8.134-53.884-1.704-53.92-1.696c-0.036-0.008-29.179-6.438-53.92,1.696c0,0-13.396-83.982,7.885-128.069c0,0-99.451-4.748-127.26,169.906c0,0-20.687,28.487-11.192,47.14c9.496,18.652,24.079,16.617,13.226,45.783c-10.852,29.165-24.418,91.905-2.713,126.497c4.616,7.357,8.74,11.855,12.407,14.987c-12.371,16.041-19.364,34.177-19.364,53.392v9.58l-37.218,21.488l37.218,21.488v3.695c0,18.491,6.497,35.976,18.008,51.563l-0.645,2.409l-6.4,23.884l23.327-8.441c29.968,27.118,76.999,45.56,130.756,48.452l14.87,25.757h2.032l14.87-25.757c53.757-2.892,100.788-21.334,130.756-48.452l23.327,8.441l-6.4-23.884l-0.645-2.409c11.511-15.588,18.008-33.072,18.008-51.563v-3.695l37.218-21.488l-37.218-21.488V528.588z M219.069,568.515l-15.345-8.859l15.345-8.859V568.515z M222.465,279.791c0,0-3.052-13.226,12.718-41.205c0,0,13.226-134.614,105.47-158.884c0,0-17.126,48.914-2.531,123.627c-15.137,10.469-30.195,31.697-30.195,31.697c17.296-17.296,32.726-19.793,32.726-19.793l0.001,0c0.004-0.007,9.507-13.563,59.344-8.478v0c0.001,0,0.002,0,0.002,0c0.001,0,0.001,0,0.002,0v0c49.837-5.085,59.34,8.472,59.345,8.478v0c0,0,15.43,2.497,32.726,19.793c0,0-15.058-21.228-30.195-31.697c14.595-74.713-2.531-123.627-2.531-123.627c92.244,24.27,105.47,158.884,105.47,158.884c15.77,27.979,12.718,41.205,12.718,41.205c-23.401,37.644-52.905-7.122-52.905-7.122c-2.898,19.873-31.74,26.855-42.376,28.766c5.663-0.604,17.291-0.914,33.728,3.283c43.116,11.008,46.292,40.187,36.118,44.257c-10.174,4.07-25.435-13.735-60.027-13.735c-34.591,0-54.431,22.892-65.113,22.892c-10.683,0-10.683-17.805-10.683-17.805c4.07-25.435,50.87-38.282,50.87-38.282c-86.479,18.523-62.401,67.956-39.678,64.904c10.431-1.401,22.424-7.495,34.449-12.653c-0.846,0.788-1.561,1.586-2.147,2.373c-6.104,8.203-16.532,13.926-16.532,13.926c9.665,0,15.261-5.056,15.261-5.056c2.798,18.854,25.944,21.079,33.065,13.958c7.121-7.122,21.365-18.313,29.759-16.787c8.394,1.526,30.522,24.417,32.048,30.267c1.526,5.85-45.02,51.379-72.999,16.533c-27.978-34.846-48.58-35.1-48.58-35.1s25.435,6.868,40.95,37.135c15.515,30.268,41.968,37.135,41.968,37.135c2.678,4.82,10.238,27.044,14.51,39.874c-0.832,2.083-1.375,4.276-1.714,6.603c-19.142-32.944-44.717-56.652-44.717-56.652c24.698,32.127,38.361,60.63,42.965,83.231c1.288,6.567,1.781,15.511,1.781,15.511c0.198,14.195-4.114,24.992-12.231,31.486c-22.044,17.635-59.349-3.052-74.27-24.418c-14.922-21.365-30.861-22.722-30.861-22.722s-3.392-0.339-3.392-14.949c0-14.61,39-18.286,27.131-23.034c-11.87-4.748-15.091-5.257-21.365-11.53c-6.274-6.274,0.847-30.013,7.46-23.4c6.613,6.613,3.052,25.435,17.975,16.957c14.922-8.478,9.156-33.574-4.07-42.391c-13.214-8.81-33.876-3.063-33.912-3.053c-0.036-0.01-20.697-5.757-33.912,3.053c-13.226,8.817-18.991,33.913-4.07,42.391c14.922,8.478,11.361-10.344,17.975-16.957c6.613-6.613,13.735,17.126,7.46,23.4c-6.274,6.274-9.495,6.783-21.365,11.53c-11.869,4.748,27.131,8.423,27.131,23.034c0,14.61-3.392,14.949-3.392,14.949s-15.939,1.357-30.861,22.722c-14.922,21.365-52.227,42.052-74.27,24.418c-8.116-6.493-12.429-17.29-12.231-31.486c0,0,0.353-8.139,1.781-15.511c4.605-22.601,18.267-51.104,42.965-83.231c0,0-25.575,23.707-44.716,56.652c-0.34-2.327-0.883-4.52-1.715-6.603c4.272-12.83,11.833-35.054,14.51-39.874c0,0,26.452-6.867,41.968-37.135c15.515-30.268,40.95-37.135,40.95-37.135s-20.602,0.254-48.58,35.1c-27.979,34.846-74.525-10.683-72.999-16.533c1.527-5.85,23.655-28.742,32.048-30.267c8.394-1.526,22.637,9.665,29.759,16.787c7.121,7.122,30.267,4.896,33.065-13.958c0,0,5.596,5.056,15.261,5.056c0,0-10.428-5.723-16.532-13.926c-0.586-0.787-1.3-1.585-2.147-2.373c12.026,5.158,24.018,11.252,34.449,12.653c22.723,3.052,46.801-46.381-39.679-64.904c0,0,46.801,12.847,50.871,38.282c0,0,0,17.805-10.683,17.805c-10.682,0-30.522-22.892-65.113-22.892c-34.592,0-49.853,17.804-60.027,13.735c-10.174-4.07-6.998-33.249,36.118-44.257c16.437-4.197,28.065-3.886,33.728-3.283c-10.636-1.911-39.478-8.892-42.376-28.766C275.37,272.669,245.866,317.435,222.465,279.791z M480.373,374.409c-13.735,0-15.515-8.012-15.515-8.012s2.999-4.103,9.559-6.979c0.533,0.509,0.869,1.224,0.869,2.019c0,1.196-0.753,2.209-1.809,2.609c0.176,0.366,0.283,0.772,0.283,1.206c0,0.7-0.266,1.332-0.691,1.823c0.883,0.612,1.952,0.975,3.107,0.975c3.02,0,5.469-2.448,5.469-5.468c0-2.028-1.116-3.777-2.755-4.721c5.498-1.474,12.708-1.872,21.83,0.524c0,0-2.254,2.543-7.231,2.543C493.489,360.928,494.108,374.409,480.373,374.409z M400,607.156c0,0-0.001,0-0.002,0v0.001c-19.328,6.881-31.535-8.919-31.535-8.919c-23.694,11.15-46.528-1.878-50.312-4.223c6.435-1.308,12.426-4.024,17.415-8.325c29.503-25.434,45.105-55.955,64.434-55.957c19.33,0.002,34.93,30.523,64.434,55.957c4.99,4.302,10.981,7.017,17.415,8.325c-3.784,2.344-26.617,15.373-50.312,4.223c0,0-12.207,15.8-31.535,8.919v-0.001C400.001,607.155,400.001,607.155,400,607.156z M359.425,436.007c0,0,8.714-20.506,40.596-12.067c31.882-8.439,40.555,12.067,40.555,12.067C426.864,418.275,400,426.728,400,426.728S373.136,418.275,359.425,436.007z M323.824,368.05c1.156,0,2.224-0.363,3.107-0.975c-0.425-0.491-0.691-1.123-0.691-1.823c0-0.434,0.108-0.84,0.283-1.206c-1.055-0.4-1.809-1.413-1.809-2.609c0-0.796,0.335-1.51,0.869-2.019c6.561,2.877,9.559,6.979,9.559,6.979s-1.78,8.012-15.515,8.012c-13.735,0-13.117-13.48-13.117-13.48c-4.978,0-7.232-2.543-7.232-2.543c9.123-2.396,16.333-1.998,21.831-0.524c-1.638,0.944-2.755,2.694-2.755,4.721C318.355,365.602,320.804,368.05,323.824,368.05z M260.482,641.18l-14.495,5.877l-2.287,0.928v-0.001l17.396-23.67l7.552,13.554L260.482,641.18z M243.303,646.686l0.572-1.935l4.903-16.602l1.561-5.285l9.84,0.768L243.303,646.686z M398.984,706.078l-1.72-2.98l-8.221-14.241l-6.663-11.541l16.605-8.157V706.078z M410.958,688.857l-8.222,14.241l-1.72,2.98V669.16l16.605,8.157L410.958,688.857z M554.013,647.057l-14.495-5.877l-8.166-3.312l7.453-13.378l17.17,23.362L554.013,647.057z M539.605,623.649l10.057-0.784l1.56,5.285l4.903,16.602l0.726,2.457L539.605,623.649z M566.852,584.84c0,11.546-3.155,22.65-8.895,33.029l-1.149-4.288l-25.673,1.97l-12.779,28.469l12.612,4.563c-26.263,20.815-64.517,35.373-106.566,39.373l9.504-16.461l-32.89-16.156h-2.032l-32.89,16.156l9.504,16.461c-42.048-4-80.301-18.558-106.564-39.373l12.611-4.563l-12.778-28.469l-25.674-1.97l-1.149,4.288c-5.74-10.379-8.895-21.484-8.895-33.029v-10.38c0.245,0.383,0.467,0.774,0.718,1.154c27.665,41.921,91.178,71.247,165.118,71.247h2.032c73.94,0,137.452-29.326,165.118-71.247c0.251-0.381,0.473-0.771,0.718-1.154V584.84z M566.134,537.813c-0.952,6.491-2.9,12.806-5.728,18.901c-20.376,43.901-86.646,76.115-159.39,76.115h-2.032c-72.743,0-139.013-32.213-159.389-76.115c-2.829-6.095-4.776-12.41-5.728-18.901c-0.447-3.042-0.718-6.114-0.718-9.225c0-16.168,6.212-31.461,17.034-45.116c5.491,4.34,9.068,10.954,11.053,34.392c-1.769,4.331-3.354,8.745-4.687,13.224c-9.388,31.581,12.641,55.102,37.618,61.87c35.468,29.361,76.331,17.488,76.331,17.488c9.657,13.722,29.466,11.704,29.503,11.7c0.036,0.004,19.846,2.022,29.503-11.7c0,0,41.709,12.263,77.319-17.751l-0.396,0.092c24.732-6.977,46.342-30.368,37.027-61.699c-1.333-4.48-2.918-8.893-4.686-13.224c1.984-23.438,5.562-30.052,11.052-34.392c10.823,13.654,17.034,28.948,17.034,45.116C566.852,531.7,566.58,534.771,566.134,537.813z M596.275,559.656l-15.345,8.859v-17.718L596.275,559.656z"
        />
      </g>
      <path
        fill="#200E0B"
        d="M422.89,588.572c7.122-7.122,15.091,12.24,47.987,6.375c0,0-10.089-3.068-31.709-24.688c-21.617-21.617-30.52-33.571-39.167-33.574v0c-0.001,0-0.001,0-0.001,0c-0.001,0-0.002,0-0.002,0v0c-8.647,0.003-17.549,11.957-39.167,33.574c-21.62,21.62-31.709,24.688-31.709,24.688c32.896,5.866,40.865-13.496,47.987-6.375c7.118,7.117,22.872,6.376,22.891,6.375C400.019,594.947,415.773,595.689,422.89,588.572z"
      />
    </g>
  </svg>
);

// Export types
export type { IconVariant, IconProps };
