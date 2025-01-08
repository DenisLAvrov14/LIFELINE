import './App.css';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Todo from './modules/Todo/Todo';
import Statistic from './modules/Statistic/Statistic';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Navigate to="/todo" />} />
            <Route path="/todo" element={<Todo />} />
            <Route path="/statistic" element={<Statistic />} />
          </Route>
          <Route path="*" element={<div>404: Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
