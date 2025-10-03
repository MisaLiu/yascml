import { useState } from 'react';
import { Layout, Typography, Divider, Steps } from 'antd';
import { SelectFilePage } from './Pages/SelectFile';
import { AdjustConfigPage } from './Pages/AdjustConfig/AdjustConfig';
import { InstallLoaderPage } from './Pages/InstallLoader';
import type { PageProps } from './Pages/types';
import './App.css';

type Page = {
  title: string,
  content: React.FC<PageProps>,
};

const { Content } = Layout;
const { Title } = Typography;

const pages: Page[] = [
  {
    title: '选择游戏文件',
    content: SelectFilePage,
  },
  {
    title: '调整加载器设置',
    content: AdjustConfigPage,
  },
  {
    title: '安装加载器',
    content: InstallLoaderPage,
  }
];

const App = () => {
  const [ currentStep, setCurrentStep ] = useState(0);

  const items = pages.map((e) => ({ key: e.title, title: e.title }));

  const nextPage = () => setCurrentStep(e => e + 1);
  const prevPage = () => setCurrentStep(e => e - 1);

  const PageContent = pages[currentStep].content;

  return (
    <Layout>
      <Content>
        <Typography>
          <Title style={{ textAlign: 'center' }}>YASCML Installer</Title>
        </Typography>
        <Divider />
        <Steps
          current={currentStep}
          items={items}
        />
        <Divider />
        <div>
          <PageContent
            handleNextPage={nextPage}
            handlePrevPage={prevPage}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default App;
