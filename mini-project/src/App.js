import './css/App.css';
import Clock from './Components/Clock';
import Draw from './Components/Draw';
import Manual from './Components/Manual';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Clock />
        <Manual />
      </header>
      <Draw />
    </div>
  );
}

export default App;
