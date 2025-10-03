import {
  Typography,
  List,
  Space,
  AutoComplete,
  Flex,
  Button
} from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useGlobalState } from '../../state';
import { AVAILABLE_MODS } from '../../consts';

const { Title } = Typography;

export const EmbedMods = () => {
  const [ embedModInput, setEmbedModInput ] = useState('');

  const embeddedMods = useGlobalState(e => e.embeddedMods);
  const setEmbeddedMods = useGlobalState(e => e.setEmbeddedMods);

  const addEmbedMod = (path: string) => {
    if (!path) return;
    if (embeddedMods.findIndex(e => e === path) !== -1) return;

    setEmbeddedMods([ ...embeddedMods, path ]);
    setEmbedModInput('');
  };

  const removeEmbedMod = (path: string) => {
    if (!path) return;
    if (embeddedMods.findIndex(e => e === path) === -1) return;

    setEmbeddedMods(embeddedMods.filter(e => e !== path));
  };

  return (
    <>
      <Title level={3}>嵌入模组</Title>
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <List
          bordered
          dataSource={embeddedMods}
          renderItem={(path) => (
            <List.Item
              key={path}
              actions={[
                <a
                  onClick={() => removeEmbedMod(path)}
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
          <AutoComplete
            options={(
              AVAILABLE_MODS
                .filter(e => !embeddedMods.includes(e))
                .map(e => ({ value: e }))
            )}
            value={embedModInput}
            onChange={setEmbedModInput}
            style={{ flex: 1 }}
          />
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => addEmbedMod(embedModInput)}
          >
            添加
          </Button>
        </Flex>
      </Space>
    </>
  );
};
