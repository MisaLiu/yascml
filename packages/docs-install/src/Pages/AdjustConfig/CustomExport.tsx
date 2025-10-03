import {
  Typography,
  List,
  Space,
  Input,
  Flex,
  Button
} from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useGlobalState } from '../../state';

const { Title } = Typography;

export const CustomExport = () => {
  const [ exportInput, setExportInput ] = useState('');

  const customExports = useGlobalState(e => e.customExports);
  const setCustomExports = useGlobalState(e => e.setCustomExports);

  const addCustomExport = (name: string) => {
    if (!name) return;
    if (customExports.findIndex(e => e === name) !== -1) return;

    setCustomExports([ ...customExports, name ]);
    setExportInput('');
  };

  const removeCustomExport = (name: string) => {
    if (!name) return;
    if (customExports.findIndex(e => e === name) === -1) return;
    
    setCustomExports(customExports.filter(e => e !== name));
  };

  return (
    <>
      <Title level={3}>自定义导出</Title>
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <List
          bordered
          dataSource={customExports}
          renderItem={(path) => (
            <List.Item
              key={path}
              actions={[
                <a
                  onClick={() => removeCustomExport(path)}
                >
                  <DeleteOutlined />
                  删除
                </a>
              ]}
            >
              {path}
            </List.Item>
          )}
        />
        <Flex
          justify='space-between'
          align='center'
          gap='small'
        >
          <Input
            value={exportInput}
            onChange={(e) => setExportInput(e.target.value)}
          />
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => addCustomExport(exportInput)}
          >
            添加
          </Button>
        </Flex>
      </Space>
    </>
  );
};
