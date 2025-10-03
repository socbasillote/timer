import React from 'react'
import { useEffect } from 'react'

import { Link } from 'react-router-dom'

function OptionsPage({ settings, setSettings}) {
    
  return (
    <div>
        <div className='backdrop-blur-md shadow-m border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-50 w-full'>
                        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                            <nav className='p-3  flex gap-3 justify-between'>
                                <Link to="/">Home</Link>
                                <Link to="/options">Options</Link>
                            </nav>
                        </div>
                    </div>
        <div className='p-5'>
            <h1 className='text-xl font-bold mb-3'>Options Page</h1>

            <div className='mb-4'>
                <p>Text: 1</p>
                <textarea
                    value={settings.text}
                    onChange={(e) => setSettings({ ...settings, text: e.target.value})}
                    className='w-full h-20 border p-2 rounded'
                />
            </div>

            <div className="mb-4">
                <p>Text 2:</p>
                <textarea 
                    value={settings.extraText}
                    onChange={(e) =>  setSettings({ ...settings, extraText: e.target.value })}
                    className='w-full h-20 border p-2 rounded'
                />
            </div>

            <div className="mb-4">
                <p>Background Color:</p>
                <input 
                    type='color'
                    value={settings.bgColor}
                    onChange={(e) => 
                        setSettings({ ...settings, bgColor: e.target.value})
                    }
                    className='w-16 h-10'
                />
                
                <input 
                    type='color'
                    value={settings.bgBreakColor}
                    onChange={(e) => 
                        setSettings({ ...settings, bgBreakColor: e.target.value})
                    }
                    className='w-16 h-10'
                />

                <input 
                    type='color'
                    value={settings.bgLongBreak}
                    onChange={(e) => 
                        setSettings({ ...settings, bgLongBreak: e.target.value})
                    }
                    className='w-16 h-10'
                />
            </div>
            
            <div className="mb-4">
                <p>Pomodoro Work Time (minutes):</p>
                <input 
                    type='number'
                    value={settings.workTime}
                    onChange={(e) =>
                        setSettings({ ...settings, workTime: Number(e.target.value)})
                    }
                    className='border p-1 rounded w-20'
                />
            </div>

            <div className="mb-4">
                <p>Pomodoro Break Time (minutes):</p>
                <input 
                    type='number'
                    value={settings.shortBreak}
                    onChange={(e) => 
                        setSettings({ ...settings, shortBreak: Number(e.target.value)})
                    }
                    className='border p-1 rounded w-20'
                />
            </div>
            
            <div className="mb-4">
                <p>Long Break Time:(minutes)</p>
                <input 
                    type='number'
                    value={settings.longBreak}
                    onChange={(e) =>
                        setSettings({ ...settings, longBreak: Number(e.target.value)})
                    }
                    className='border p-1 rounded w-20'
                />
            </div>

            <div className="mb-4">
                <p>Long Break Interval</p>
                <select 
                    value={settings.longBreakInterval}
                    onChange={(e) =>
                        setSettings({ ...settings, longBreakInterval: Number(e.target.value)})
                    }
                    className='border p-1 rounded w-20'
                >
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </div>

            <div className="mb-4">
                <p>Auto Break</p>
                <input 
                    type='checkbox'
                    checked={settings.autoBreak}
                    onChange={(e) => setSettings({...settings, autoBreak: e.target.checked})}
                    
                />
            </div>

            <p>Notification</p>

            <div className="mb-4">
                <p>Enable Notifiication</p>
                <input 
                    type='checkbox'
                    checked={settings.notificationOn}
                    onChange={(e) => setSettings({...settings, notificationOn: e.target.checked})}
                    
                />
            </div>
            
            <div className="mb-4">
                <p>Notification time</p>
                <input 
                    type='number'
                    value={settings.notificationTime}
                    onChange={(e) =>
                        setSettings({ ...settings, notificationTime: Number(e.target.value)})
                    }
                    className='border p-1 rounded w-20'
                />
            </div>
        </div>
    </div>
  )
}

export default OptionsPage