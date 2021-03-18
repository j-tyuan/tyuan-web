import React, {useState} from 'react';
import {Divider, Select} from 'antd';
import {SelectProps} from 'antd/es/select';
import {Spin} from 'antd/es';
import {debounce} from 'lodash';
import {request} from "@@/plugin-request/request";


export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  initValue?: any,
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any>({fetchOptions, debounceTimeout = 400, ...props}: DebounceSelectProps) {
  const {onChange, initValue} = props
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState<ValueType[]>([]);
  const [value, setValue] = useState<any>();
  const fetchRef = React.useRef(0);

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (v: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(v).then(newOptions => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };
    if (initValue) {
      loadOptions(initValue)
      setValue(initValue)
    }

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select<ValueType>
      value={value}
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small"/> : null}
      showSearch
      onChange={(v) => {
        setValue(v)
        // @ts-ignore
        onChange(v)
      }}
    >
      {
        options.map(e => (
          <Select.Option key={e.value} value={e.value}>{e.label}</Select.Option>
        ))
      }
    </Select>
  );
}

// Usage of DebounceSelect
interface UserValue {
  label: React.ReactNode;
  value: string;
}

function Item(data: any) {
  const {item} = data;
  const {empNo, empNameEn} = item
  return (<>
    {empNameEn}
    <Divider type="vertical"/>
    {empNo}
  </>)
}


async function fetchUserList(value: string): Promise<UserValue[]> {
  if (!value) {
    return [];
  }
  return fetchUser(value).then(result => {
    const {errorCode, data} = result;
    if (errorCode === -1) {
      const newData: any[] | PromiseLike<any[]> = [];
      data.forEach((e: any) => {
        newData.push({
          label: <Item key={e.id} item={{...e}}/>,
          value: e.id
        })
      })
      return newData;
    }
    return []
  })
}

interface EmployeeSelectProps {
  uid?: any,
  onChange: (uid: any) => void;
}

const EmployeeSelect: React.FC<EmployeeSelectProps> = (props) => {
  const {uid, onChange} = props;

  return (
    <DebounceSelect
      initValue={uid}
      placeholder="请选择员工"
      fetchOptions={fetchUserList}
      onChange={newValue => {
        onChange(newValue);
      }}
      style={{width: '100%'}}
    />
  );
}

export async function fetchUser(value: any) {
  return request(`/api/org/emp/fetch/${value}`, {
    method: 'GET',
  });
}

export default EmployeeSelect;

