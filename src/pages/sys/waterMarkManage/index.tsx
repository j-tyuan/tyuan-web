/** Title: 自定义配置 */
import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Col, Divider, message, Row, Space, Spin, Tooltip} from 'antd';
import {WaterMark} from '@ant-design/pro-layout';
import ProForm, {ProFormColorPicker, ProFormDependency, ProFormSlider, ProFormText,} from '@ant-design/pro-form';
import {useIntl} from "umi";
import {Switch} from 'antd/es';
import {getParamsByKey, updateParams} from "@/pages/sys/paramManage/service";
import {FormInstance} from "antd/es/form";

const handleWaterMark = async (data: any) => {
  const hide = message.loading('正在配置...');
  try {
    const {id} = data;
    const v = await updateParams({
      id,
      paramKey: "sys.watermark",
      isSys: true,
      paramName: "水印管理",
      paramVal: JSON.stringify(data)
    });
    hide();
    if (v.errorCode === -1) {
      message.success('配置完成，生效还需要等待一段时间');
      return true;
    }
    return false;
  } catch (error) {
    hide();
    message.error('失败请重试！');
    return false;
  }
}


export default () => {
  const [subLoading, setSubLoading] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(true);
  const formRef = useRef<FormInstance>();
  const [waterMarkData, setWaterMarkData] = useState<any>({
    enable: false,
    content: '示例水印',
    fontColor: 'rgba(0,0,0,.15)',
    fontSize: '16',
    zIndex: '9',
    rotate: '-22',
    gapX: 10,
    gapY: 20,

  })
  const waterBoxs = document.getElementsByClassName("waterBox");
  waterBoxs[0].style.display = "none";

  const switchChange = (dis: any) => {
    const newData = {...waterMarkData, enable: dis};
    setWaterMarkData(newData);
    handleWaterMark({...newData})
  }

  const full = (dis: any) => {
    const newData = {...waterMarkData, isFull: dis};
    setWaterMarkData(newData);
    handleWaterMark({...newData})
  }

  const tools = () => {
    return (
      <Space>
        <Switch
          checkedChildren="开启水印"
          unCheckedChildren="关闭"
          checked={waterMarkData.enable} onChange={switchChange}/>
        <Tooltip title={"局部：只有内容有水印，全局：覆盖整个页面"}>
          <Switch
            checkedChildren="全局"
            unCheckedChildren="局部"
            disabled={!waterMarkData.enable}
            checked={waterMarkData.isFull} onChange={full}/>
        </Tooltip>
      </Space>
    )
  }

  useEffect(() => {
    setLoading(true)
    getParamsByKey("sys.watermark").then(e => {
      const {errorCode, data} = e;
      if (errorCode === -1 && data) {
        const {paramVal, id} = data;
        const newData = {...waterMarkData, ...JSON.parse(paramVal), id};
        setWaterMarkData(newData);
        formRef.current?.setFieldsValue({...newData})
      }
      setLoading(false)
    })
    return () => {
      waterBoxs[0].style.display = "block";
    }
  }, [])
  return (
    <Spin spinning={loading}>
      <ProForm
        formRef={formRef}
        onValuesChange={(changeValues) => {
          setWaterMarkData({...waterMarkData, ...changeValues});
        }}
        submitter={false}
      >
        <Card title={tools()} bordered>
          <Row gutter={[10, 10]}>
            <Col span={18}>
              <Card>
                <ProFormDependency
                  name={['rotate', 'content', 'fontColor', 'fontSize', 'zIndex', 'gapX', 'gapY']}>
                  {({rotate, content, fontColor, fontSize, zIndex, gapX, gapY}) => {
                    return (
                      <WaterMark
                        rotate={rotate}
                        content={content}
                        fontColor={fontColor}
                        fontSize={fontSize}
                        zIndex={zIndex}
                        gapX={gapY}
                        gapY={gapX}
                      >
                        <div>
                          <p>
                            Copyright (c) 2020-2038, Jiangguiqi 齐 (<a
                            href="mailto:author@tyuan.design">author@tyuan.design</a>).
                            <p/>
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            Licensed under the Apache License, Version 2.0 (the 'License');
                            you may not use this file except in compliance with the License.
                            You may obtain a copy of the License at
                            <p/>
                            <a
                              href="http://www.apache.org/licenses/LICENSE-2.0">http://www.apache.org/licenses/LICENSE-2.0</a>
                            <p/>
                            Unless required by applicable law or agreed to in writing, software
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            distributed under the License is distributed on an "AS IS" BASIS,
                            WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                            See the License for the specific language governing permissions and
                            limitations under the License.
                          </p>
                          <p>
                            Lorem ipsum javabase.cn sit amet javabase.cn adipisicing elit. Illo praesentium,
                            aperiam numquam javabase.cn asperiores odio? Doloribus saepe, eligendi facere
                            inventore culpa, exercitationem explicabo earum laborum deleniti reiciendis
                            deserunt accusantium ullam.
                          </p>
                          <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia voluptas
                            numquam impedit architecto facilis aliquam at assumenda, nostrum explicabo
                            accusantium ipsam error provident voluptate molestias magnam quisquam
                            excepturi illum sit!
                          </p>
                          <p>
                            It was considered a virtue not to talk unnecessarily atsea and the old man had always
                            considered it so and respected it. But now he said his thoughts aloud many times since
                            there was no noe that they could annoy
                          </p>
                        </div>
                        <h4>
                          下面是一张zIndex 为 10 的 position 为 relative 图片，
                          <br/> 如果要在图片中展示水印尝试调大右侧的 zIndex 滑块试试。
                        </h4>
                        <img
                          src="https://gw.alipayobjects.com/zos/bmw-prod/d283f09a-64d6-4d59-bfc7-37b49ea0da2b.svg"
                          alt="示例图片"
                          width={600}
                          style={{zIndex: 10, position: 'relative'}}
                        />
                      </WaterMark>
                    );
                  }}
                </ProFormDependency>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="配置面板">
                <ProFormText disabled={!waterMarkData.enable} label="水印文字" name="content"/>
                <ProFormColorPicker disabled={!waterMarkData.enable} label="字体颜色" name="fontColor"/>
                <ProFormSlider disabled={!waterMarkData.enable} label="字体大小" name="fontSize"/>
                <ProFormSlider disabled={!waterMarkData.enable} label="zIndex" name="zIndex" min={0} max={100}/>
                <ProFormSlider disabled={!waterMarkData.enable} label="旋转角度" name="rotate" min={-90} max={90}/>

                <ProFormSlider disabled={!waterMarkData.enable} label="水平间距" name="gapX" min={50} max={300}/>
                <ProFormSlider disabled={!waterMarkData.enable} label="垂直间距" name="gapY" min={50} max={300}/>
                <Divider/>
                <Space>
                  <Button disabled={!waterMarkData.enable}
                          type="primary"
                          loading={subLoading}
                          onClick={() => {
                            setSubLoading(true)
                            handleWaterMark(waterMarkData).then(() => setSubLoading(false));
                          }}>
                    {useIntl().formatMessage({id: 'app.form.submit'})}
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>
      </ProForm>
    </Spin>
  );
};
