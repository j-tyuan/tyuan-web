import {Tree} from 'antd';
import Search from "antd/es/input/Search";
import React from 'react';

interface KeyTreeProps {
  treeData: any
}

const onExpand = () => {

}


const KeyTree: React.FC<KeyTreeProps> = (props) => {
  const {treeData} = props;
  return (
    <div>
      <Search style={{marginBottom: 8}} placeholder="Search"/>
      <Tree
        onExpand={onExpand}
        treeData={treeData}
      />
    </div>
  )
}

export default KeyTree;
