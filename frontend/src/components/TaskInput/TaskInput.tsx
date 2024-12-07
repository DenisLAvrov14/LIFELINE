import { FC } from "react";
import styles from "./TaskInput.module.css";
import cx from "classnames";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string | undefined;
};

export const TaskInput: FC<Props> = ({ type = "text", className, ...rest }) => {
    return (
        <input type={type} className={cx(styles.taskInput, className)} {...rest} />
    );
};
