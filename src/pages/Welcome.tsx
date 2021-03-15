import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Button, Card, Col, Image, Row} from 'antd';
import {request} from "@@/plugin-request/request";

export default (): React.ReactNode => {

  const [visit, setVisit] = useState();

  useEffect(() => {
    const promise = getVisit();
    promise.then(e => {
      const {errorCode, data} = e
      if (errorCode === -1) {
        setVisit(data)
      }
    })
  }, [])

  return (
    <PageContainer>
      <Card title={<>本项目由<Button type='link'>河南软达</Button>开源并提供技术支持</>}>
        <Row align="middle">
          <Col span={12} style={{textAlign: 'center'}}>
          <span>
           您是第：<span style={{fontSize: 24, margin: '0 10px'}}>{visit}</span>位访问者
          </span>
            <div>
              <span>支持定制开发，如果您有需求请扫右边二维码，期待与您的合作</span>
            </div>
          </Col>
          <Col span={12} style={{textAlign: 'center'}}>
            <Image height='400px' width='350px' src="/wx.jpg"/>
          </Col>
        </Row>

      </Card>
    </PageContainer>
  )
};

export async function getVisit() {
  return request('/api/test/visit', {
    method: 'GET'
  });
}

