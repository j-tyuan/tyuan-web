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
      <Card title={<>本项目由<a href="mailto:author@tyuan.design">author@tyuan.design</a>开源并提供技术支持</>}>
        <Row align="middle">
          <Col span={12} style={{textAlign: 'center'}}>
            <Image height='400px' width='350px' src="/wx.jpg"/>
          </Col>
          <Col span={12} style={{textAlign: 'center'}}>
            <Image height='400px' width='350px' src="/qq.png"/>
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

