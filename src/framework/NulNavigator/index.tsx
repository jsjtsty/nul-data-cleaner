import React from 'react';
import { Navigate } from 'react-router-dom';
import { NulReviseDatabase } from '../../util/database/NulReviseDatabase';
import { asyncAction } from '../../util/system/Promise';

interface NulNavigatorProps {
  filler?: string;
  editor?: string;
  dataStore: string;
}

const NulNavigator = (props: NulNavigatorProps): JSX.Element => {
  const { filler = 'upload', editor = 'editor', dataStore } = props;

  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [dataPresent, setDataPresent] = React.useState<boolean>(false);

  React.useEffect(() => {
    asyncAction({
      action: async () => {
        const database = new NulReviseDatabase(dataStore);
        await database.connect();
        const data = await database.load();
        console.log(data);
        setDataPresent(data.length > 0);
        setLoaded(true);
      }
    });
  });

  return loaded ? <Navigate to={dataPresent ? editor : filler} replace /> : <div>Redirecting...</div>;
};

export default NulNavigator;