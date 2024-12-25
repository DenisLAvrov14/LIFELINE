import React from "react";
import { Props } from "../../models/ProgressItem";

const ProgressSection: React.FC<Props> = ({ title, items }) => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-4">
            <span className="w-1/4 text-gray-700 font-medium">{item.label}</span>
            <progress
              className="flex-grow h-4 rounded bg-gray-300 overflow-hidden appearance-none"
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
