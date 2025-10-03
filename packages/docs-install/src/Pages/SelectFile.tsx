import { Typography, Upload, Divider, Flex, Button } from 'antd';
import {
  InboxOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useGlobalState } from '../state';
import type { PageProps } from './types';

const { Title } = Typography;
const { Dragger } = Upload;

export const SelectFilePage = ({
  handleNextPage
}: PageProps) => {
  const gameFile = useGlobalState(e => e.gameFile);
  const setGameFile = useGlobalState(e => e.setGameFile);

  return (
    <>
      <Title level={3}>选择文件</Title>
      <Dragger
        accept="text/html"
        multiple={false}
        showUploadList={false}
        beforeUpload={(blob) => {
          setGameFile(blob);
          return false;
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          {gameFile ? (
            `当前文件：${gameFile.name}`
          ): '点击选择或拖拽文件到此'}
        </p>
      </Dragger>
      <Divider />
      <Flex justify='flex-end'>
        <Button
          type='primary'
          icon={<ArrowRightOutlined />}
          iconPosition='end'
          disabled={!gameFile}
          onClick={handleNextPage}
        >
          下一步
        </Button>
      </Flex>
    </>
  );
};
