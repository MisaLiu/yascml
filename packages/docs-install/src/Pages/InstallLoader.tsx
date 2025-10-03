import { Divider, Flex, Button } from 'antd';
import {
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useGlobalState } from '../state';
import type { PageProps } from './types';

export const InstallLoaderPage = ({
  handlePrevPage
}: PageProps) => {
  const state = useGlobalState();

  return (
    <>
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
