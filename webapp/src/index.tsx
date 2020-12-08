import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Admin from './Admin'
import App from './App'
import Home from './Home'
import './index.scss'
import Overlay from './Overlay'
import './styles/HeaderBar.css'
import './styles/TextEditor.css'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route path="/new">
          <Overlay />
        </Route>
        <Route path="/admin">
          <Admin />
        </Route>
        <Route path="/:id">
          <App />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
