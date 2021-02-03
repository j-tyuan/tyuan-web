import {PageContainer} from "@ant-design/pro-layout";
import React, {useEffect, useState} from "react";
import {Col, Row} from 'antd';
import KeyTree from "@/pages/monitor/redis/components/keyTree";
import {queryKeys} from "@/pages/monitor/redis/service";

const RedisMonitor: React.FC<{}> = () => {
  const [treeData, setTreeData] = useState();
  const getTreeKeys = async () => {
    const result = await queryKeys();
    return result.data;
  }
  useEffect(() => {
    getTreeKeys().then(e => {
      setTreeData(e);
    })
  })

  return (
    <PageContainer>
      <Row>
        <Col span={5}>
          <KeyTree treeData={treeData}/>
        </Col>
        <Col span={19}>
          <Row>
            <Col span={24}>2</Col>
          </Row>
          <Row>
            <Col span={24}>3</Col>
          </Row>
        </Col>
      </Row>
    </PageContainer>
  )

}

export default RedisMonitor;
