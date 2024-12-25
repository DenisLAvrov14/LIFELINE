import React from "react";
import styles from "./AvatarBlock.module.css";

type Props = {
  imageUrl?: string; // Необязательное изображение
};

const AvatarBlock: React.FC<Props> = ({ imageUrl }) => {
  return (
    <div
      className={styles.avatar}
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
      }}
    ></div>
  );
};

export default AvatarBlock;
