import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Salutation from './Greeting.jsx'
import { DisplayChocotorta } from './Chocotorta.jsx'
import './index.css'
import App from './Animals.jsx'
import Buttons from './Buttons.jsx'
import PackingList from './Packed.jsx'
import Person from './Person.jsx'
import Component from './Count.jsx'
import CustomInput from './CustomInput.jsx'
import { RenderName } from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RenderName/>
    <CustomInput />
    <Component />
    <Person />
    <DisplayChocotorta />
    <Salutation />
    <App />
    <PackingList />
    <Buttons />
  </StrictMode>,
)
