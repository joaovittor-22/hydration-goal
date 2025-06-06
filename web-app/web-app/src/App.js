import logo from './logo.svg';
import './App.css';
import WaterTrackerScreen from './pages/PersonGoal';
import PersonRegister from './pages/PersonRegister';
import { Routes, Route, Link } from 'react-router-dom';
import PersonHistoryScreen from './pages/History';


function App() {
  return (
    <div className="App">
      <Routes>
         <Route path="/history" element={<PersonHistoryScreen />} />
         <Route path="/" element={<PersonRegister />} />
         <Route path="/goal" element={<WaterTrackerScreen />} />
      </Routes>
    </div>
  );
}

export default App;
