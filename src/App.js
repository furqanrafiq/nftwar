import logo from './logo.svg';
import './App.css';
import Topnav from './components/Topnav';
import Main from './views/Main';
import { Route, Routes } from 'react-router-dom';
import TeamMintMain from './views/TeamMintMain';

function App() {
  return (
    <div className="App">
      <Topnav />
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/team-mint' element={<TeamMintMain />} />
        {/* <Route path='/test' */}
      </Routes>
    </div>
  );
}

export default App;
