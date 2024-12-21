import React from 'react';
import styles from './Statistics.module.css';

const Statistics: React.FC = () => {
  return (
    <div className={styles.userBlock}>
      <div className={styles.avatar}></div>
      <div className={styles.statistics}>
        <h1>NAME NAME</h1>
        <div className={styles.container}>
          <section className={styles.healthSection}>
            <h2>Physical Health and Activity</h2>
            <ul>
              <li>
                Health
                <progress
                  className={styles.progressBar}
                  value="70"
                  max="100"
                ></progress>
              </li>
              <li>
                Fitness
                <progress
                  className={styles.progressBar}
                  value="50"
                  max="100"
                ></progress>
              </li>
            </ul>
          </section>
          <section className={styles.intellectualSection}>
            <h2>Intellectual Development</h2>
            <ul>
              <li>
                Intelligence
                <progress
                  className={styles.progressBar}
                  value="80"
                  max="100"
                ></progress>
              </li>
              <li>
                Creativity
                <progress
                  className={styles.progressBar}
                  value="60"
                  max="100"
                ></progress>
              </li>
            </ul>
          </section>
          <section className={styles.socialSection}>
            <h2>Social Activity and Community Contribution</h2>
            <ul>
              <li>
                Social Ability
                <progress
                  className={styles.progressBar}
                  value="90"
                  max="100"
                ></progress>
              </li>
              <li>
                Community Contribution
                <progress
                  className={styles.progressBar}
                  value="40"
                  max="100"
                ></progress>
              </li>
              <li>
                Environmental Responsibility
                <progress
                  className={styles.progressBar}
                  value="30"
                  max="100"
                ></progress>
              </li>
            </ul>
          </section>
          <section className={styles.knowledgeSection}>
            <h2>Knowledge and Languages</h2>
            <ul>
              <li>
                Specialized Knowledge
                <progress
                  className={styles.progressBar}
                  value="75"
                  max="100"
                ></progress>
              </li>
              <li>
                Foreign Language Proficiency
                <progress
                  className={styles.progressBar}
                  value="85"
                  max="100"
                ></progress>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
