import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {TableListItem} from './data';
import {getLogType, query} from './service';
import {Input, Modal, Tooltip} from "antd";
import ReactJson from "react-json-view";
import "./log.less"
import {CopyToClipboard} from 'react-copy-to-clipboard/lib/index';
import {message} from 'antd/es';

const getJSONObject = (val: any) => {
  try {
    return JSON.parse(val);
  } catch (e) {
    return val;
  }
}

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [valueType, setValueType] = useState();

  useEffect(() => {
    const promise = getLogType();
    promise.then((request) => {
      const {errorCode, data} = request;
      if (errorCode === -1) {
        setValueType(data)
      }
    })
  }, [])

  const columns: ProColumns<TableListItem>[] = [
    {
      title: "请求ID",
      dataIndex: "requestId",
      ellipsis: true,
      width: 200,
      fixed: 'left',
      render(_, item) {
        const val = item.requestId;
        return (
          <CopyToClipboard text={val} onCopy={() => {
            message.success("已拷贝")
          }}>
            <Tooltip title={val}>
              <a className="ant-typography-ellipsis-single-line">{val}</a>
            </Tooltip>
          </CopyToClipboard>)
      }
    },
    {
      title: "日志类型",
      width: 100,
      dataIndex: "type",
      valueType: "select",
      valueEnum: valueType
    },
    {
      width: 200,
      title: "日志标题",
      dataIndex: "title",
    },
    {
      title: "操作人",
      width: 150,
      dataIndex: "userName"
    },
    {
      title: "操作人IP",
      dataIndex: "remoteAddr",
      width: 150,
      search: false,
    },
    {
      title: "请求方法",
      dataIndex: "method",
      search: false,
      width: 100,
      render(_, item) {
        const val = item.method;
        return (<>
          <CopyToClipboard text={val} onCopy={() => {
            message.success("已拷贝")
          }}>
            <Tooltip title={val}>
              <a>{val.substring(val.lastIndexOf(".") + 1, val.length)}</a>
            </Tooltip>
          </CopyToClipboard>
        </>)
      }
    },
    {
      title: "提交参数",
      ellipsis: true,
      dataIndex: "userAgent",
      search: false,
      render(_, item) {
        const obj = getJSONObject(item.userAgent);
        let show;
        if (obj instanceof Object) {
          show = <ReactJson style={{maxHeight: 300, overflow: "auto"}} src={obj}/>;
        } else {
          show = <Input.TextArea value={item.userAgent}/>
        }
        return <>
          {
            obj ?
              <a onClick={() => {
                Modal.info({
                  title: "入参",
                  width: 500,
                  icon: false,
                  content: show
                })
              }} className="ant-typography-ellipsis-single-line">{item.userAgent}</a> :
              "-"
          }
        </>
      }
    },
    {
      title: "异常信息",
      ellipsis: true,
      search:false,
      width: 100,
      dataIndex: "exception",
      render(_, item) {
        const obj = getJSONObject(item.exception);
        let show;
        if (obj instanceof Object) {
          show = <ReactJson style={{maxHeight: 300, overflow: "auto"}} src={obj}/>;
        } else {
          show = <Input.TextArea value={item.exception}/>
        }
        return <>
          {
            obj ?
              <a onClick={() => {
                Modal.info({
                  title: "异常信息",
                  width: 500,
                  icon: false,
                  content: show
                })
              }} className="ant-typography-ellipsis-single-line">{obj["异常信息"]}</a> :
              "无"
          }
        </>
      }
    },
    {
      width: 200,
      title: "操作时间",
      dataIndex: "createDate",
      hideInForm: true,
      search: false,
      valueType: 'dateTime',
    },
    {
      title: "耗时",
      dataIndex: "duration",
      hideInForm: true,
      search: false,
      render(_, item) {
        return `${item.duration}ms`
      }
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        scroll={{x: 1400}}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => []}
        request={(params, sorter, filter) => query({...params, sorter, filter})}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
