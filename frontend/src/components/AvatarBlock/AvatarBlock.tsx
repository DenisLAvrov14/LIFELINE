import React from 'react';

type Props = {
  imageUrl?: string; // Необязательное изображение
  altText?: string; // Alt-текст для изображения
};

const AvatarBlock: React.FC<Props> = ({
  imageUrl,
  altText = 'User Avatar',
}) => {
  return (
    <div
      className="w-24 h-24 sm:w-20 sm:h-20 xs:w-16 xs:h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span className="text-gray-500 dark:text-gray-300 text-base sm:text-sm xs:text-xs">
          Avatar
        </span>
      )}
    </div>
  );
};

export default AvatarBlock;
