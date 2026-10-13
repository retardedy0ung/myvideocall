import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css';
import Register from './pages/register';
import Home from './pages/home';
import Login from './pages/login';
import Videopage from './pages/videopage';
import Createmeeting from './pages/Createmeeting';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes> 
         <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
          <Route path='/create' element={<Createmeeting/>}/>
      
        <Route path='/login' element={<Login/>}/>
        <Route path='/video' element={<Videopage/>}/></Routes></BrowserRouter>
    </div>
  );
}

export default App;
