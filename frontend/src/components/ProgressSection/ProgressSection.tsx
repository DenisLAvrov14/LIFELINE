import React from 'react';
import { Props } from '../../models/ProgressItem';

const ProgressSection: React.FC<Props> = ({ title, items }) => {
  return (
    <section className="mb-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center sm:text-left">
        {title}
      </h2>
      <ul className="space-y-6">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0"
          >
            <span className="w-full sm:w-1/4 text-gray-700 dark:text-gray-300 font-medium text-center sm:text-left">
              {item.label}
            </span>
            <progress
              className="w-full sm:flex-grow h-4 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden appearance-none"
              value={item.value}
              max="100"
            >
              {item.value}%
            </progress>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProgressSection;
