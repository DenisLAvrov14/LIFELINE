import { useContext, useEffect } from "react";
import { ThemeContext } from "../../providers/ThemeProvider";
import { BiSun, BiMoon } from "react-icons/bi";

export const ChangeTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      // Default to light theme if no theme is saved
      document.documentElement.classList.add("light");
      setTheme("light");
    }
  }, [setTheme]);

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-md hover:shadow-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300"
    >
      {theme === "dark" ? (
        <BiSun title="Switch to Light Theme" className="text-2xl" />
      ) : (
        <BiMoon title="Switch to Dark Theme" className="text-2xl" />
      )}
    </button>
  );
};

export default ChangeTheme;
