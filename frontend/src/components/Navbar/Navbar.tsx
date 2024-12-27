import { useState } from "react";
import Statistic from "../../modules/Statistic/Statistic";
import Todo from "../../modules/Todo/Todo";
import ChangeTheme from "../../components/ChangeTheme/ChangeTheme";

const tabs = [
  { label: "Todo", icon: "✅", component: <Todo /> },
  { label: "Statistic", icon: "📊", component: <Statistic /> },
];

const Navbar = () => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Верхняя панель */}
      <header className="bg-gray-200 dark:bg-gray-800 shadow-md">
        <div className="flex justify-between items-center px-6 py-3">
          {/* Навигация */}
          <nav className="flex space-x-4">
            {tabs.map((item) => (
              <button
                key={item.label}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  item === selectedTab
                    ? "bg-blue-500 text-white dark:bg-blue-600 font-semibold"
                    : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                }`}
                onClick={() => setSelectedTab(item)}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
  
          {/* Кнопка смены темы */}
          <ChangeTheme />
        </div>
      </header>
  
      {/* Основное содержимое */}
      <main className="p-6">
        <div
          className="animate-fadeIn"
          key={selectedTab.label}
        >
          {selectedTab.component}
        </div>
      </main>
    </div>
  );  
};

export default Navbar;
