import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, App, theme } from 'antd';
import MyApp from './App';
import './index.css';

const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <App>
        <MyApp />
      </App>
    </ConfigProvider>
  </StrictMode>,
);
