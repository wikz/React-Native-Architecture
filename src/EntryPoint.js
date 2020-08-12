import React, { useEffect, useState, useCallback } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components/native';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaView, PermissionsAndroid } from 'react-native';

import { store, persistor } from '@services/state/configureStore';
import Themes, { SUPPORTED_THEMES } from '@themes/';
import ErrorBoundary from '@containers/ErrorBoundary';
import Home from '@containers/Home';

const PERMISSIONS = [];

const EntryPoint = () => {
  const [stateRef, setStateRef] = useState({
    grantedPermissions: {},
  });

  // componentDidMount
  useEffect(() => {
    checkPermissions(PERMISSIONS);
  }, [checkPermissions]);

  // componentDidUpdate
  useEffect(() => {
    const { grantedPermissions } = stateRef;

    const deniedPermissions = PERMISSIONS.filter(
      (permission) => grantedPermissions[permission] !== PermissionsAndroid.RESULTS.GRANTED
    );

    if (deniedPermissions.length > 0) {
      checkPermissions(deniedPermissions);
    }
  }, [checkPermissions, stateRef]);

  const checkPermissions = useCallback(
    async (permissions) => {
      try {
        const grantedPermissions = await PermissionsAndroid.requestMultiple(permissions);
        setStateRef({ ...stateRef, grantedPermissions });
      } catch (error) {
        setStateRef({ ...stateRef, grantedPermissions: error });
      }
    },
    [stateRef]
  );

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={Themes.getTheme(SUPPORTED_THEMES.LIGHT)}>
          <ErrorBoundary>
            <SafeAreaView>
              <Home />
            </SafeAreaView>
          </ErrorBoundary>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default EntryPoint;
