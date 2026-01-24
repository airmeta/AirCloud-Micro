
const CLIENT_KEY = 'client_config';

const APP_KEY = 'app_config';


import { clientConfig, appSettings } from '@/store/modules/login/appStatusDto';

const isInit = () => {
  return !!sessionStorage.getItem(CLIENT_KEY);
};

const getClientConfig = () => {
  const clientConfigString = sessionStorage.getItem(CLIENT_KEY);
  if (clientConfigString) {
    return JSON.parse(clientConfigString) as clientConfig;
  }
  return null;
};

const setClientConfig = (client: clientConfig) => {
  sessionStorage.setItem(CLIENT_KEY, JSON.stringify(client));
};

const clearClientConfig = () => {
  sessionStorage.removeItem(CLIENT_KEY);
};

const getClientAppConfig = () => {
  const config = sessionStorage.getItem(APP_KEY);
  if (config) {
    return JSON.parse(config) as appSettings;
  }
  return null;
}
const setClientAppConfig = (appConfig: appSettings) => {
  sessionStorage.setItem(APP_KEY, JSON.stringify(appConfig));

}
const removeClientAppConfig = () => {
  sessionStorage.removeItem(APP_KEY);
};
export { isInit, getClientConfig, setClientConfig, clearClientConfig, getClientAppConfig, setClientAppConfig, removeClientAppConfig };