import React, { FC } from 'react';
import styles from './IconButton.module.css';
import { WithChildren } from '../../models/WithChildren';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & WithChildren;

export const IconButton: FC<Props> = ({ children, ...rest }) => {
  return (
    <button className={styles.IconButton} {...rest}>
      {children}
    </button>
  );
};
