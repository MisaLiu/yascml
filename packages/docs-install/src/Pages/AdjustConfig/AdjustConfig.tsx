import {
  Divider,
  Flex,
  Button
} from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { EmbedMods } from './EmbedMods';
import { CustomExport } from './CustomExport';
import { CustomInit } from './CustomInit';
import type { PageProps } from '../types';

export const AdjustConfigPage = ({
  handleNextPage,
  handlePrevPage,
}: PageProps) => {
  return (
    <>
      <EmbedMods />
      <Divider />
      <CustomExport />
      <Divider />
      <CustomInit />
      <Divider />
      <Flex justify='space-between'>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handlePrevPage}
        >
          上一步
        </Button>
        <Button
          type='primary'
          icon={<ArrowRightOutlined />}
          iconPosition='end'
          onClick={handleNextPage}
        >
          下一步
        </Button>
      </Flex>
    </>
  );
};
