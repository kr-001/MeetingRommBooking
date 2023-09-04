import './App.css';
import {Routes,Route} from 'react-router-dom'
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import Homepage from './components/Homepage';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/userDashboard' element={<UserDashboard/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
  );
}

export default App;
