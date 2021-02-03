import React, {useState} from "react";
import {Col, Input, Row} from "antd";

interface Props {
  onChange: (value: string) => void;
}

const pasArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const KBPassword: React.FC<Props> = (props) => {

  const [password, setPassword] = useState<string>()
  const handleClick = () => {
    let pwd = "";
    const pasArrLen = pasArr.length;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 16; i++) {
      const x = Math.floor(Math.random() * pasArrLen);
      pwd += pasArr[x];
    }
    setPassword(pwd)
    props.onChange(pwd)
  }

  return (
    <Row gutter={8}>
      <Col span={18}>
        <Input onChange={(e) => {
          const val = e.currentTarget.value;
          setPassword(val);
          props.onChange(val)
        }} name="password" value={password}/>
      </Col>
      <Col span={6}>
        <a onClick={handleClick}>生成</a>
      </Col>
    </Row>
  )
}

export default KBPassword;
