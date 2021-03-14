import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Input, message, Modal, Row, Tabs, Tooltip} from "antd";
import TextArea from "antd/es/input/TextArea";
import {Space, Upload} from "antd/es";
import {CheckOutlined, LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import './style.less'
import {useModel} from "@@/plugin-model/useModel";
import {PureSettings} from "@ant-design/pro-layout/es/defaultSettings";
import {setCustomLayout, update} from "./service";

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: any) => {
  const hide = message.loading('正在更新..');
  try {
    const v = await update({...fields});
    hide();
    if (v.errorCode === -1) {
      message.success('更新完成');
      return true;
    }
    return false;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
  return true;
}

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}


export interface CustomLayoutProps {
  type: string,
  check: boolean,
  title: string,
  onChange: (type: string) => void;
}

export const CostomLayout: React.FC<CustomLayoutProps> = (props) => {
  const {type, check, onChange, title} = props;
  return (
    <Tooltip title={title}>
      <div
        className={`ant-pro-setting-drawer-block-checkbox-item ant-pro-setting-drawer-block-checkbox-item-${type}`}
        onClick={() => {
          onChange(type);
        }}
      >
        <CheckOutlined hidden={!check} className="ant-pro-setting-drawer-block-checkbox-selectIcon"/>
      </div>
    </Tooltip>
  )
}


const Settings: React.FC<{}> = () => {
  const {initialState} = useModel('@@initialState');
  const {currentUser} = initialState;
  const [currentLayout, setCurrentLayout] = useState<PureSettings>();

  const [submitAccountLoading, setSubmitAccountLoading] = useState<boolean>();
  const [uploadLoading, setUploadLoading] = useState<boolean>();
  const [imageUrl, setImageUrl] = useState();

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setUploadLoading(false);
        setImageUrl(imageUrl)
      });
    }
  }


  const uploadAvatar = (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="/api/account/photo"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl
        ? <Button type="dashed" style={{height: '100%', width: '100%'}}>
          <img src={imageUrl} alt="avatar"
               style={{width: '100%', height: '100px'}}/></Button>
        : <Button type="dashed" style={{height: '100%', width: '100%'}}
                  icon={uploadLoading ? <LoadingOutlined/> : <PlusOutlined/>}>
          Upload
        </Button>}
    </Upload>
  )

  const customLayoutHandel = (layout: any) => {
    const hide = message.loading({content: "正在加载.."});
    setCurrentLayout({...layout});
    const promise = setCustomLayout(layout);

    promise.then(e => {
      const {errorCode} = e;
      if (errorCode === -1) {
        Modal.confirm({
          content: "主题修改成功，是否刷新页面？", onOk() {
            window.location.href = window.location.href;
          }
        })
      }
      hide();
    }).then(hide)
  }

  useEffect(() => {
    setCurrentLayout({...currentUser.layout})
    setImageUrl(currentUser.photo)
  }, [])

  const baseInfoSettings = (
    <Form layout="vertical" initialValues={currentUser} onFinish={(data) => {
      setSubmitAccountLoading(true)
      handleUpdate(data).then(() => {
        setSubmitAccountLoading(false)
      })
    }}>
      <Form.Item hidden name='userid'>
        <Input/>
      </Form.Item>
      <Form.Item label="邮箱" name='email' rules={[{required: true, type: 'email'}]}>
        <Input/>
      </Form.Item>
      <Form.Item label="昵称" name='name' rules={[{required: true}]}>
        <Input/>
      </Form.Item>
      <Form.Item label="个人简介" name='remarks'>
        <TextArea/>
      </Form.Item>
      <Form.Item label="联系电话" name='phone'
                 rules={[{required: true, pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: "请输入正确的手机号"}]}>
        <Input/>
      </Form.Item>
      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitAccountLoading}>更新用户信息</Button>
        </Space>
      </Form.Item>
    </Form>
  )

  return (
    <Card>
      <Tabs tabPosition="left">
        <Tabs.TabPane tab="基本设置" key="1">
          <Row>
            <Col span={5}>
              {baseInfoSettings}
            </Col>
            <Col span={8}>
              {uploadAvatar}
            </Col>
            <Col span={11}>
              <Card title="整体风格" bordered={false}>
                <Space>
                  <CostomLayout
                    title='两色菜单风格'
                    type="light"
                    check={currentLayout?.navTheme === 'light'}
                    onChange={(type) => {
                      customLayoutHandel({...currentLayout, navTheme: type})
                    }}/>
                  <CostomLayout
                    title='暗菜单风格'
                    type="realDark"
                    check={currentLayout?.navTheme === 'realDark'}
                    onChange={(type) => {
                      customLayoutHandel({...currentLayout, navTheme: type})
                    }}/>
                </Space>
              </Card>
              <Card title="导航模式" bordered={false}>
                <Space>
                  <CostomLayout title='侧边菜单布局' type="side" check={currentLayout?.layout === 'side'}
                                onChange={(type) => {
                                  customLayoutHandel({...currentLayout, layout: type})
                                }}/>
                  <CostomLayout title='顶部菜单布局' type="top" check={currentLayout?.layout === 'top'} onChange={(type) => {
                    customLayoutHandel({...currentLayout, layout: type})
                  }}/>
                  <CostomLayout title='混合菜单布局' type="mix" check={currentLayout?.layout === 'mix'} onChange={(type) => {
                    customLayoutHandel({...currentLayout, layout: type})
                  }}/>
                </Space>
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="安全设置" key="2">
          正在开发中....
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default Settings;
