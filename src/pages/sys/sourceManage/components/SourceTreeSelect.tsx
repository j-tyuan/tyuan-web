import React, {useEffect, useState} from 'react';
import {TreeSelect} from 'antd';
import {getByParentId} from "@/pages/sys/sourceManage/service";

interface Props {
  onChange: (pid: any) => void;
  initialId?: any;
}

const SourceTreeSelect: React.FC<Props> = (props) => {
  const [treeData, setTreeData] = useState<any[]>([{id: 0, key: 0, pId: -1, value: 0, title: '跟节点'}]);
  const [value, setValue] = useState();
  const handleTree = (e: { data: any; }) => {
    const iarr: any[] = [];
    const {data} = e;
    const newData: { id: any; pId: any; value: any; title: any; }[] = []
    data.forEach((item: { isLeaf: any; id: any; parentId: any; name: any; }) => {
      if (!item.isLeaf) {
        iarr.push(item.id)
        newData.push({
          id: item.id,
          pId: item.parentId,
          value: item.id,
          title: item.name
        })
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-shadow
    treeData.forEach(e => {
      if (iarr.indexOf(e.id) === -1) {
        newData.push(e)
        iarr.push(e.id)
      }
    })
    setTreeData([...newData]);
  }
  const onChange = (v: any) => {
    setValue(v)
    props.onChange(v);
  };
  const onLoadData = (treeNode: { props: { id: any; }; }) => {
    const {id} = treeNode.props;
    return new Promise(resolve => {
      const parentId = id;
      const result = getByParentId({parentId})
      result.then(e => {
        handleTree(e)
        resolve();
      })
    });
  }

  useEffect(() => {
    const id = props.initialId;
    if (!id || id <= 0) {
      setValue(props.initialId)
      return;
    }
    const result = getByParentId({id})
    result.then(e => {
      handleTree(e)
      setValue(props.initialId)
    })
  }, [])

  return (
    <TreeSelect
      treeDataSimpleMode
      style={{width: '100%'}}
      value={value}
      dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
      placeholder="Please select"
      onChange={onChange}
      loadData={onLoadData}
      treeData={treeData}
    />
  );
}


export default SourceTreeSelect;

