import {
  Divider,
  Flex,
  Typography,
  Switch,
  Tooltip,
  Button
} from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useGlobalState } from '../../state';
import { EmbedMods } from './EmbedMods';
import { CustomExport } from './CustomExport';
import { CustomInit } from './CustomInit';
import type { PageProps } from '../types';

const { Title } = Typography;

export const AdjustConfigPage = ({
  handleNextPage,
  handlePrevPage,
}: PageProps) => {
  const singleMode = useGlobalState(e => e.singleFile);
  const setSingleMode = useGlobalState(e => e.setSingleFile);

  return (
    <>
      <EmbedMods />
      <Divider />
      <CustomExport />
      <Divider />
      <CustomInit />
      <Divider />
      <Title level={3}>其他设置</Title>
      <Flex>
        <Tooltip
          title='对于直接分发和运行游戏文件来说最合适，但文件大小会略微变大，视嵌入的模组数量与大小而异'
        >
          <label>
            <Switch
              value={singleMode}
              onChange={setSingleMode}
              style={{ marginRight: 8 }}
            />
            单文件模式
          </label>
        </Tooltip>
      </Flex>
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
