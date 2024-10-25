import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import TrainList from './components/TrainList';
import TrainDetails from './components/TrainDetails';
import Booking from './components/Booking';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/trains" element={<TrainList />} />
            <Route path="/trains/:id" element={<TrainDetails />} />
            <Route path="/booking" element={<Booking />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
