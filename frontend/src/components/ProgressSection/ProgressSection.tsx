import React from "react";
import styles from "./ProgressSection.module.css";
import { Props } from "../../models/ProgressItem";


const ProgressSection: React.FC<Props> = ({ title, items }) => {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.label}
            <progress
              className={styles.progressBar}
              value={item.value}
              max="100"
            ></progress>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProgressSection;
