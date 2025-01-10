import { useContext, useEffect } from 'react';
import { BiSun, BiMoon } from 'react-icons/bi';
import { ThemeContext } from '../../providers/ThemeProvider/ThemeProvider';

const ChangeTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, [setTheme]);

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-md hover:shadow-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300 top-[-6px] sm:top-0" // Указываем `top-[-6px]` для мобильных и `sm:top-0` для остальных
    >
      {theme === 'dark' ? (
        <BiSun title="Switch to Light Theme" className="text-2xl sm:text-xl" />
      ) : (
        <BiMoon title="Switch to Dark Theme" className="text-2xl sm:text-xl" />
      )}
    </button>
  );
};

export default ChangeTheme;
