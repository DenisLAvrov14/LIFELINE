import { useContext, useEffect } from 'react';
import { ThemeContext } from '../../providers/ThemeProvider';
import { BiSun, BiMoon } from 'react-icons/bi';
import styles from './ChangeTheme.module.css';

export const ChangeTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  return (
    <button className={styles.ChangeTheme} onClick={toggleTheme}>
      {theme === 'dark' ? (
        <BiSun title="Light theme" />
      ) : (
        <BiMoon title="Dark theme" />
      )}
    </button>
  );
};

export default ChangeTheme;
