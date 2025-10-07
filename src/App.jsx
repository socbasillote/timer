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
        bgColor: "#FF0000",
        bgBreakColor: "#3e3e3e",
        bgLongBreak: "#f0fff8",
        workTime: 0.2,
        shortBreak: 0.1,
        longBreak: 6,
        longBreakInterval: 4,
        autoBreak: true,
        autoLongBreak: true,
        notificationOn: true,
        notificationTime: 1,
        notificationVolume: 0.5,
        bgImage: "",
        fontStyle: "",
        subFont:"",
        progressStyle: 'ring',
        focusMode: true,
      };
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
