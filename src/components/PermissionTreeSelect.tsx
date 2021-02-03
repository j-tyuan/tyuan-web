import React, {useEffect, useState} from 'react';
import {TreeSelect} from 'antd';

interface Props {
  permission: Object;
  onChange: (permissions:[]) => void;
  initialIds?: [];
  multiple?: any;
}

const PermissionTreeSelect: React.FC<Props> = (props) => {
  const [treeData, setTreeData] = useState();
  const [value, setValue] = useState();
  const onChange = (v: any) => {
    setValue(v);
    props.onChange(v);
  };

  useEffect(() => {
    const {permission} = props;
    const newData = [];
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const i in permission) {
      const {id, parentId, name} = permission[i]
      const item = {
        id,
        pId: parentId,
        title: name,
      }
      newData.push(item);
    }
    // @ts-ignore
    setTreeData(newData);
  }, [])

  return (
    <TreeSelect
      multiple={props.multiple === true}
      treeDataSimpleMode
      defaultValue={props.initialIds}
      style={{width: '100%'}}
      value={value}
      dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
      placeholder="Please select"
      onChange={onChange}
      treeData={treeData}
    />
  );
}


export default PermissionTreeSelect;

