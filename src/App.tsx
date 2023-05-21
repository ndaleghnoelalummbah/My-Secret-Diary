import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* define your routes here using Route components */}
          <Route> </Route>
        </Routes>
      </Router>
      <h1 style={{color:"blue",fontSize:"48px",textAlign:"center",marginTop:"22px"}}> ""Welcome to Diary app"""</h1>
    </Provider>
  );
}

export default App;
//Routes componenent wraps the varion independent Route. and this Routes replaces Switch with react-router-dom versions from 6
