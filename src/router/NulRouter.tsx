import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AgricultureMultipleReviser } from '../pages/RevisePages/AgricultureMultipleReviser';
import UploadPage from '../pages/UploadPage';


const NulRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/editor" element={<AgricultureMultipleReviser />} />
      </Routes>
    </Router>
  );
};

export default NulRouter;