import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from './components/auth';
import StockList from './components/stockList';
import './App.css';

function App() {
  return (
    <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" >
              <Auth />
            </Route>
            <Route path="/dashboard" >
              <StockList />
            </Route>
          </Switch>
        </div>
    </Router>
  );
}

export default App;
