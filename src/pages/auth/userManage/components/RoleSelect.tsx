import React, {useEffect, useState} from "react";
import {Checkbox} from "antd";
import { loadUserRoles } from "../service";

interface Props {
  // 默认选择
  uid?: any;
  roles?: any[];
  onChange: (roleIds: any[]) => void;
}

const RoleSelect: React.FC<Props> = (props) => {
  const {uid,onChange,roles} = props;
  const [checkedList, setCheckedList] = useState<any[]>([]);

  useEffect(() => {
    if (uid) {
      const promise = loadUserRoles(uid);
      promise.then(arr => {
        setCheckedList([...arr])
      })
    }

  }, [uid])

  return (
    <>
      {
        roles?.map((item) => (
          <Checkbox
            value={item.id}
            key={item.id}
            checked={checkedList.indexOf(item.id) >= 0} onChange={(val) => {
            const cd = val.target.checked;
            if (cd) {
              const id = checkedList.find(var1 => var1 === item.id);
              if (!id) {
                checkedList.push(item.id)
                setCheckedList([...checkedList]);
                onChange([...checkedList])
              }
            } else {
              const newList = checkedList.filter(var1 => var1 !== item.id)
              setCheckedList([...newList])
              onChange([...newList])
            }
          }}>{item.roleName}</Checkbox>
        ))
      }
    </>
  )
}

export default RoleSelect;
