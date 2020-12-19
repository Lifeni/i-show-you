import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Admin from './Admin'
import App from './App'
import Home from './Home'
import './index.scss'
import './global.css'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route path="/404">
          <Home />
        </Route>
        <Route path="/500">
          <Home />
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
        <Route path="*">
          <Redirect to={{ pathname: '/404' }} />
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
