import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from './pages/HomePage';
import OptionsPage from './pages/OptionsPage';
import { useEffect } from 'react';

import './App.css'


function App() {
  const [permission, setPermission] = useState(Notification.permission);

  const [settings, setSettings] = useState( () => {
    const saved = localStorage.getItem("appSettings");
    return saved
    ? JSON.parse(saved)
    : {
        text: "",
        extraText: "",
        bgColor: "#fff",
        bgBreakColor: "#AAF5FF",
        bgLongBreak: "#D3DBFF",
        workTime: 0.2,
        shortBreak: 0.1,
        longBreak: 6,
        longBreakInterval: 4,
        autoBreak: true,
        autoLongBreak: true,
        notificationOn: true,
        notificationTime: 5,
        notificationVolume: 0.5,
        bgImage: "https://images.unsplash.com/photo-1479030160180-b1860951d696?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        fontStyle: "",
        subFont:"",
        progressStyle: 'ring',
        focusMode: true,
      };
  })

  // todo
/*   const [pomodoroSettings, setPomodoroSettings] = useState( () => {
    const saved = localStorage.getItem('pomodoroSettings');
    return saved 
    ? JSON.parse(saved)
    : {
      bgColor: "",
      bgBreakColor: "",
      bgLongBreak: "",
      workTime: "",
      shortBreak: "",
      longBreak: "",
      longBreakInterval: 4,
      autoBreak: true,
      autoLongBreak: true,
      notificationOn: true,
      notificationTime: 1,
      notificationVolume: 0.5,
      progressStyle: 'ring',
      focusMode: true,
    }
  }) */

  const [userRecord, setUserRecord] = useState(() => {
    const saved = localStorage.getItem('userRecord');
    return saved
    ? JSON.parse(saved)
    : {
      sessionCount: 0,
      entireSessionCount: 0,
      shortbreakCount: 0,
      longbreakCount: 0,
    }
  })

  const [uiSettings, setUiSettings] = useState(() => {
    const saved = localStorage.getItem('uiSettings');
    return saved
    ? JSON.parse(saved)
    : {
      weather: "none",
      waves: false,
      rain: false,
      forest: false,
      fireplace: false,
      wavesVolume: 0.5,
      rainVolume: 0.5,
      forestVolume: 0.5,
      fireplaceVolume: 0.5,
    }
  })

  const [clockSettings, setClockSettings] = useState(() => {
    const saved = localStorage.getItem('clockSettings');
    return saved
    ? JSON.parse(saved)
    : {
      timeFormat: "12h",     // "12h" or "24h"
      showSeconds: false,
      showDate: false,
      fontStyle: "monospace"
    }
  })



  // Save text to LocalStorage whenever it changes
 useEffect(() => {
  localStorage.setItem('appSettings', JSON.stringify(settings));
  
 }, [settings]);
  
 useEffect(() => {
  localStorage.setItem('userRecord', JSON.stringify(userRecord));
  
 }, [userRecord]);
  

  return (
    <div className='rain'>
      
      <Router>
        <Routes>
          <Route 
            path='/' 
            element={ 
                      <HomePage 
                        settings={settings} 
                        setSettings={setSettings} 
                        uiSettings={uiSettings}
                        setUiSettings={setUiSettings}
                        clockSettings={clockSettings}
                        setClockSettings={setClockSettings}
                        userRecord={userRecord}
                        setUserRecord={setUserRecord}
                      />
                    } 
          />
          <Route 
            path='/options' 
            element={<OptionsPage settings={settings} setSettings={setSettings} />} 
          />

        </Routes>
      </Router>
    </div>
  )
}

export default App
