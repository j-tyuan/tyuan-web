import React, {useEffect, useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {TableListItem} from './data';
import {query} from './service';
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
  useEffect(() => {

  }, [])

  const columns: ProColumns<TableListItem>[] = [
    {
      title: "日志类型",
      dataIndex: "type"
    },
    {
      title: "日志标题",
      dataIndex: "title",
    },
    {
      title: "操作人",
      dataIndex: "userName",
      render(_, item) {
        return `${item.userName} id: ${item.userId}`
      }
    },
    {
      title: "操作人IP",
      dataIndex: "remoteAddr"
    },
    {
      title: "请求地址",
      dataIndex: "requestUri"
    },
    {
      title: "请求方法",
      dataIndex: "method",
      width: 200,
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
      width: 200,
      dataIndex: "userAgent",
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
      width: 200,
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
              "-"
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
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
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
