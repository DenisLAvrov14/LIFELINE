import { useState } from 'react';
import { motion } from 'framer-motion';
import './Navbar.css';
import Statistic from '../../modules/Statistic/Statistic';
import Todo from '../../modules/Todo/Todo';

const tabs = [
  { label: 'Todo', icon: '✅', component: <Todo /> },
  { label: 'Statistic', icon: '📊', component: <Statistic /> },
  // { label: 'Map', icon: '🗺️', component: <></>},
  // { label: 'Social', icon: '👥', component: <></> }
];

const Navbar = () => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <>
      <div className="navbar">
        <nav>
          <ul>
            {tabs.map((item) => (
              <li
                key={item.label}
                className={item === selectedTab ? 'selected' : ''}
                onClick={() => setSelectedTab(item)}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
                {item === selectedTab ? (
                  <motion.div className="underline" layoutId="underline" />
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="main-content">
        <motion.div
          key={selectedTab ? selectedTab.label : 'empty'}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {selectedTab.component}{' '}
          {/* Замените комментарий на рендеринг соответствующего компонента */}
        </motion.div>
      </div>
    </>
  );
};

export default Navbar;
