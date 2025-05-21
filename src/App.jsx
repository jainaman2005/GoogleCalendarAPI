import { useState } from 'react';
import './App.css'
import AuthButton from "./components/AuthButton.jsx";
import CreateEventForm from "./components/CreateEventForm.jsx";
import {Header} from "./components/Header/Header.jsx"
import { Footer } from './components/Footer/Footer.jsx';
import Calendar from './components/Calendar.jsx';
// import { listCalendarEvents } from './api/googleCalendarApi.jsx';
function App() {
  const [activeComponent ,setActiveComponent] = useState(null);
  const onClickView = ()=> setActiveComponent('view');
  const onClickAdd = ()=> setActiveComponent('add');
  return (
    <>
      <Header onClickAdd={onClickAdd} onClickView={onClickView}/>
      <AuthButton/>
      {activeComponent === 'add' && <CreateEventForm/> }
      {activeComponent === 'view' && <Calendar/>}
      <Footer/>
    </>
  )
}

export default App
