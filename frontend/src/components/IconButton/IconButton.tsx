import React, { FC } from "react";
import { WithChildren } from "../../models/WithChildren";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & WithChildren;

export const IconButton: FC<Props> = ({ children, className, ...rest }) => {
  return (
    <button
      className={`flex items-center justify-center p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-lg hover:scale-105 ${
        className ? className : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
      }`}
      {...rest}
    >
      {children}
    </button>
  );  
};

