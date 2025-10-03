import { useState, useRef } from 'react';
import { Result, Divider, Flex, Button } from 'antd';
import {
  SmileOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  DownloadOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useGlobalState } from '../state';
import { installLoaderToFile } from '../installer';
import type { PageProps } from './types';

export const InstallLoaderPage = ({
  handlePrevPage
}: PageProps) => {
  const state = useGlobalState();

  const [ status, setStatus ] = useState(-1);
  const resultFileRef = useRef<File>(null);

  const handleStartInstall = () => {
    setStatus(0);

    installLoaderToFile(state)
      .then((e) => {
        resultFileRef.current = e;
        setStatus(1);
      })
      .catch((e) => {
        console.error(e);
        setStatus(-2);
      });
  };

  const handleSaveFile = () => {
    const { current: file } = resultFileRef;
    if (!file) return;

    const dom = document.createElement('a');
    dom.href = URL.createObjectURL(file);
    dom.download = file.name;
    dom.click();
  };

  const icon = ((status: number) => {
    if (status === 1) return <CheckCircleOutlined />;
    if (status === 0) return <SyncOutlined spin />;
    if (status === -2) return <WarningOutlined />;
    return <SmileOutlined />;
  })(status);

  const title = ((status: number) => {
    if (status === 1) return '安装完成';
    if (status === 0) return '正在安装中';
    if (status === -2) return '出错了';
    return '一切准备就绪';
  })(status);

  const subTitle = ((status: number) => {
    if (status === 1) return '请点击下面的按钮保存文件';
    if (status === 0) return '视游戏大小与网络环境，安装速度可能略长，请耐心等待';
    if (status === -2) return '您可以检查游戏文件和配置后重试，或者打开控制台检查报错内容';
    return '点击下面的按钮安装加载器，您也可以返回并检查设置';
  })(status);

  const extra = ((status: number) => {
    if (status === 1) return [
      <Button
        type='primary'
        icon={<SaveOutlined />}
        onClick={handleSaveFile}
        key='save'
      >
        保存
      </Button>
    ];
    if (status === 0) return [];
    if (status === -2) return [
      <Button
        icon={<SyncOutlined />}
        onClick={handleStartInstall}
        key='retry'
      >
        重试
      </Button>
    ];
    return [
      <Button
        type='primary'
        icon={<DownloadOutlined />}
        onClick={handleStartInstall}
        key='start'
      >
        安装
      </Button>
    ];
  })(status);

  return (
    <>
      <Result
        status={(
          status === 1 ? 'success' :
          status === -2 ? 'error' : 'info'
        )}
        icon={icon}
        title={title}
        subTitle={subTitle}
        extra={extra}
      />
      <Divider />
      <Flex justify='flex-start'>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handlePrevPage}
        >
          上一步
        </Button>
      </Flex>
    </>
  );
};
