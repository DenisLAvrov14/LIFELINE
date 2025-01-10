import './App.css';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Todo from './modules/Todo/Todo';
import Statistic from './modules/Statistic/Statistic';
import PrivateRoute from './providers/PrivateRoute/PrivateRoute';
import Login from './components/Login/Login';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Navigate to="/todo" />} />
            <Route
              path="/todo"
              element={
                <PrivateRoute>
                  <Todo />
                </PrivateRoute>
              }
            />
            <Route
              path="/statistic"
              element={
                <PrivateRoute>
                  <Statistic />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<div>404: Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
