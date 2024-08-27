import React from 'react';

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';

import CollagePage from './CollagePage';
import UploadPage from './UploadPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/collage" element={<CollagePage />} />
      </Routes>
    </Router>
  );
}

export default App;
