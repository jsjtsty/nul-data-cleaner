import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AgricultureMultipleReviser } from '../pages/RevisePages/AgricultureMultipleReviser';
import NulNavigator from '../framework/NulNavigator';
import NulUploader from '../framework/NulUploader';
import { AgricultureProblemReviser } from '../pages/RevisePages/AgricultureProblemReviser';
import { AgricultureMultipleDataEntry, AgricultureMultipleParser } from '../util/parsers/AgricultureMultipleParser';
import { AgricultureProblemDataEntry, AgricultureProblemParser, AgricultureProblemResultParser } from '../util/parsers/AgricultureProblemParser';
import { AgricultureImageReviser } from '../pages/RevisePages/AgricultureImageReviser';
import NulAlertBox from '../components/NulAlertBox';
import { useAppDispatch, useAppSelector } from '../action/hooks';
import { selectGlobalAlertActivated, selectGlobalAlertTitle, selectGlobalAlertMessage, selectGlobalAlertSeverity, globalAlertActions } from '../action/GlobalAlert';
import { selectRouterNavigation, selectRouterActivated } from '../action/Router';
import { LoginPage } from '../pages/LoginPages/LoginPage';
import { RegisterPage } from '../pages/LoginPages/RegisterPage';
import { AgricultureImageBenchmarkReviser } from '../pages/RevisePages/AgricultureImageBenchmarkReviser';
import { AgricultureProblemSolutionReviser } from '../pages/RevisePages/AgricultureProblemSolutionReviser';
import { SelectionPage } from '../pages/SelectionPage/SelectionPage';
import { AgricultureImageProblemSolutionReviser } from '../pages/RevisePages/AgricultureImageProblemSolutionReviser';

interface NulRouterHelperProps {
  children: JSX.Element;
}

const NulRouterHelper: React.FC<NulRouterHelperProps> = (props) => {

  const dispatch = useAppDispatch();

  const globalAlertActivated = useAppSelector(selectGlobalAlertActivated);
  const globalAlertTitle = useAppSelector(selectGlobalAlertTitle);
  const globalAlertMessage = useAppSelector(selectGlobalAlertMessage);
  const globalAlertSeverity = useAppSelector(selectGlobalAlertSeverity);

  return (
    <>
      <Router>
        {props.children}
      </Router>
      <NulAlertBox
        open={globalAlertActivated}
        autoHideDuration={6000}
        onClose={() => { dispatch(globalAlertActions.clear()); }}
        severity={globalAlertSeverity}
        message={globalAlertMessage}
        title={globalAlertTitle}
      />
    </>
  );
};


const NulRouterContent: React.FC = () => {

  const navigate = useNavigate();

  const navigation = useAppSelector(selectRouterNavigation);
  const navigationActivated = useAppSelector(selectRouterActivated);

  React.useEffect(() => {
    if (navigationActivated) {
      navigate(navigation.url, { state: navigation.state });
    }
  }, [navigationActivated, navigation, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
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
      <Route path="/image" element={<AgricultureImageReviser />} />
      <Route path="/image-benchmark" element={<AgricultureImageBenchmarkReviser />} />
      <Route path="/problem-solution" element={<AgricultureProblemSolutionReviser />} />
      <Route path="/image-problem" element={<AgricultureImageProblemSolutionReviser />} />
      <Route index element={<SelectionPage />} />
    </Routes>
  );
};

const NulRouter: React.FC = () => {
  return (
    <NulRouterHelper>
      <NulRouterContent />
    </NulRouterHelper>
  );
};

export default NulRouter;