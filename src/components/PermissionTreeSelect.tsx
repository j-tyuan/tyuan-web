import React, {useEffect, useState} from 'react';
import {TreeSelect} from 'antd';

interface Props {
  permission: Object;
  onChange: (permissions: any[]) => void;
  initialIds?: any[];
  multiple?: any;
}

const PermissionTreeSelect: React.FC<Props> = (props) => {
  const [treeData, setTreeData] = useState<any[]>();
  const [value, setValue] = useState();
  const onChange = (v: any) => {
    setValue(v);
    props.onChange(v);
  };

  useEffect(() => {
    const {permission} = props;
    const newData: any[] = [];
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const i in permission) {
      const {id, parentId, permissionName} = permission[i]
      const item = {
        id,
        pId: parentId,
        title: permissionName,
        value: id
      }
      newData.push(item);
    }
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
      placeholder="请选择"
      onChange={onChange}
      treeData={treeData}
    />
  );
}


export default PermissionTreeSelect;

