import { FC } from 'react';
import cx from 'classnames';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string | undefined;
};

export const TaskInput: FC<Props> = ({ type = 'text', className, ...rest }) => {
  return (
    <input
      type={type}
      className={cx(
        'block max-w-md w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all',
        className
      )}
      {...rest}
    />
  );
};
