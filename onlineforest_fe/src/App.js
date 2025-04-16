import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import MarketingPage from "./components/marketing-page/MarketingPage"; // Cập nhật đường dẫn phù hợp
import SignUp from "./components/sign-up/SignUp"; // Cập nhật đường dẫn phù hợp
import SignIn from "./components/sign-in/SignIn"; // Cập nhật đường dẫn phù hợp
import Dashboard from "./components/dashboard/Dashboard"; // Cập nhật đường dẫn phù hợp




function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<MarketingPage />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
  );
}

export default App;
