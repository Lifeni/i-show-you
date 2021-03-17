import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Admin from './components/Admin'
import App from './components/App'
import Home from './components/Home'
import './index.scss'
import './global.css'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path="/404">
          <Home />
        </Route>
        <Route exact path="/500">
          <Home />
        </Route>
        <Route exact path="/admin">
          <Admin />
        </Route>
        <Route path="/:id">
          <App />
        </Route>
        <Route exact path="/">
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
