import {
  Typography,
  List,
  Space,
  Flex,
  Button,
  Modal,
  Input,
  App,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import AceEditor from 'react-ace';
import { useState } from 'react';
import { useGlobalState } from '../../state';
import { toFirstUpper, toFirstLower } from '../../utils';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

const { Title } = Typography;

export const CustomInit = () => {
  const { message } = App.useApp();

  const [ modalOpen, setModalOpen ] = useState(false);
  const [ initName, setInitName ] = useState('');
  const [ initCode, setInitCode ] = useState('');

  const customInits = useGlobalState(e => e.customInits);
  const setCustomInits = useGlobalState(e => e.setCustomInits);

  const addCustomInit = (name: string, code: string) => {
    if (!name || !code) return;
    
    setCustomInits({
      ...customInits,
      [name]: code,
    });
  };

  const editCustomInit = (name: string) => {
    if (!name) return;
    if (Object.keys(customInits).findIndex(e => e === name) === -1) return;

    const code = customInits[name];
    setInitName(toFirstUpper(name));
    setInitCode(code);
    openModal();
  };

  const removeCustomInit = (name: string) => {
    if (!name) return;
    if (Object.keys(customInits).findIndex(e => e === name) === -1) return;
    
    const result = { ...customInits };
    delete result[name];
    setCustomInits(result);
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setInitName('');
    setInitCode('');
    setModalOpen(false);
  };

  return (
    <>
      <Title level={3}>自定义初始化方法</Title>
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <List
          bordered
          dataSource={Object.keys(customInits)}
          renderItem={(name) => (
            <List.Item
              key={name}
              actions={[
                <a
                  onClick={() => editCustomInit(name)}
                >
                  <EditOutlined />
                  编辑
                </a>,
                <a
                  onClick={() => removeCustomInit(name)}
                >
                  <DeleteOutlined />
                  删除
                </a>
              ]}
            >
              init{toFirstUpper(name)}
            </List.Item>
          )}
        />
        <Flex
          justify='flex-end'
        >
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={openModal}
          >
            添加
          </Button>
        </Flex>
      </Space>
      <Modal
        title='添加自定义初始化方法'
        width={600}
        centered
        keyboard={false}
        maskClosable={false}
        open={modalOpen}
        onOk={() => {
          if (!initName) return message.error('方法名称不能为空');
          if (!initCode) return message.error('方法代码不能为空');

          addCustomInit(toFirstLower(initName), initCode);
          closeModal();
        }}
        onCancel={closeModal}
      >
        <Space direction='vertical' size='small' style={{ width: '100%' }}>
          <Flex
            justify='space-between'
            align='center'
            gap='small'
          >
            <div>方法名：</div>
            <Input
              addonBefore='init'
              value={initName}
              onChange={(e) => setInitName(e.target.value)}
              style={{ flex: 1 }}
            />
          </Flex>
          <AceEditor
            mode='javascript'
            theme='monokai'
            value={initCode}
            onChange={setInitCode}
            name='CustomInitCodeEditor'
            placeholder={`// console.log('Hello world!')`}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true
            }}
            style={{ width: '100%' }}
          />
        </Space>
      </Modal>
    </>
  );
};
