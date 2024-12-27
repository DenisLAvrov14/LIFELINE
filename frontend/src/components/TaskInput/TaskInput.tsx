import { FC } from "react";
import cx from "classnames";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string | undefined;
};

export const TaskInput: FC<Props> = ({ type = "text", className, ...rest }) => {
  return (
    <input
      type={type}
      className={cx(
        "border border-gray-300 rounded-md px-3 py-2 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow",
        className
      )}
      {...rest}
    />
  );  
};
