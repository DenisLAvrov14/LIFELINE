import React from "react";

type Props = {
  imageUrl?: string; // Необязательное изображение
};

const AvatarBlock: React.FC<Props> = ({ imageUrl }) => {
  return (
    <div
      className={`w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden`}
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!imageUrl && (
        <span className="text-gray-500 dark:text-gray-300 text-lg">Avatar</span>
      )}
    </div>
  );
  
};

export default AvatarBlock;
