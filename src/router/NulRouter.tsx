import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AgricultureMultipleReviser } from '../pages/RevisePages/AgricultureMultipleReviser';
import NulNavigator from '../framework/NulNavigator';
import NulUploader from '../framework/NulUploader';
import { AgricultureProblemReviser } from '../pages/RevisePages/AgricultureProblemReviser';
import { AgricultureMultipleDataEntry, AgricultureMultipleParser } from '../util/parsers/AgricultureMultipleParser';
import { AgricultureProblemDataEntry, AgricultureProblemParser, AgricultureProblemResultParser } from '../util/parsers/AgricultureProblemParser';


const NulRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/multiple">
          <Route index element={<NulNavigator dataStore='test' />} />
          <Route path="upload" element={
            <NulUploader<AgricultureMultipleDataEntry>
              parser={new AgricultureMultipleParser()}
              resultParser={new AgricultureMultipleParser()}
              dataStore='test'
            />
          } />
          <Route path="editor" element={<AgricultureMultipleReviser />} />
        </Route>
        <Route path="/problems">
          <Route index element={<NulNavigator dataStore='problems' />} />
          <Route path="upload" element={
            <NulUploader<AgricultureProblemDataEntry>
              parser={new AgricultureProblemParser()}
              resultParser={new AgricultureProblemResultParser()}
              dataStore='problems'
            />
          } />
          <Route path="editor" element={<AgricultureProblemReviser />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default NulRouter;