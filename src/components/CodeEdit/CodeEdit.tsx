import React, {useEffect, useState} from "react";
import {Button, Modal, Space} from "antd";

import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css';
// 主题风格
import 'codemirror/theme/cobalt.css';

import 'codemirror/mode/groovy/groovy';
import 'codemirror/mode/css/css';
// ctrl+空格代码提示补全
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';

import 'codemirror/addon/hint/anyword-hint.js';
// 代码高亮
import 'codemirror/addon/selection/active-line';
// 折叠代码
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/edit/closebrackets';
import './customer-code.less'
import {useIntl} from "@@/plugin-locale/localeExports";
import {hashCode} from "@/utils/utils";


interface Props {
  isModalVisible: boolean,
  onOk: (value: string) => void;
  cancel: () => void;
  value: string
}

const MIN_WIDTH = 800;
const MAX_WIDTH = '100%';

const MIN_HEIGHT = 300
const MAX_HEIGHT = window.innerHeight - 300

const CodeEdit: React.FC<Props> = (props) => {

  const [isMax, setIsMax] = useState<boolean>(false)
  const [width, setWidth] = useState<any>(MIN_WIDTH);
  const {onOk, isModalVisible, cancel, value} = props;
  const [val, setVal] = useState(value);
  const [editor, setEditor] = useState();
  const [has, setHas] = useState<number>();
  const [valueHasTimeout, setValueHasTimeout] = useState<any>();
  const [saveFlag, setSaveFlag] = useState<boolean>(false);

  const cancelHandel = () => {
    if (saveFlag) {
      Modal.confirm({
        content: "代码发生改变，确定不需要保存吗？", onOk() {
          cancel()
        }
      })
      return;
    }
    cancel()
  }

  useEffect(() => {
    const h = hashCode(value);
    setHas(h);
  }, [])

  return (
    <>
      <Modal title={`编辑脚本 ${saveFlag ? '*' : ''}`}
             keyboard={false}
             maskClosable={false}
             footer={(<>
               <Space>
                 <Button type="primary" htmlType="button" onClick={() => {
                   onOk(val);
                 }}>
                   {useIntl().formatMessage({id: 'app.form.submit'})}
                 </Button>
                 <Button htmlType="button" onClick={() => {
                   setWidth(isMax ? MIN_WIDTH : MAX_WIDTH)
                   setIsMax(!isMax);
                   if (editor) {
                     // @ts-ignore
                     editor.setSize(-1, isMax ? MIN_HEIGHT : MAX_HEIGHT)
                   }
                 }}>
                   {isMax ? '缩小' : '扩大'}
                 </Button>
                 <Button htmlType="button" onClick={cancelHandel}>
                   {useIntl().formatMessage({id: 'app.form.close'})}
                 </Button>
               </Space>
             </>)}
             className="groovy-edit-box"
             width={width}
             visible={isModalVisible}
             onCancel={cancelHandel}>
        <CodeMirror
          options={{
            mode: {
              // https://codemirror.net/mode/index.html
              name: 'text/x-groovy'
            },
            // https://codemirror.net/demo/theme.html#cobalt 上面css文件也要替换
            theme: 'cobalt',
            autoScroll: true,
            // 自动获取焦点
            autofocus: true,
            // 光标代码高亮
            styleActiveLine: true,
            // 显示行号
            lineNumbers: true,
            // 自动缩进
            smartIndent: true,
            // start-设置支持代码折叠
            lineWrapping: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            // 自定义提示选项
            hintOptions: {
              completeSingle: false,
              tables: {
                users: ['name', 'score', 'birthDate'],
                countries: ['name', 'population', 'size'],
                score: ['zooao']
              }
            }
          }}
          value={value}
          editorDidMount={(_editor) => {
            setEditor(_editor);
          }}
          onKeyPress={(_editor) => {
            _editor.showHint();
          }}
          onChange={(instance) => {
            const v = instance.getValue();

            // 输入缓冲区
            const timeout = setTimeout(function () {
              const hs = hashCode(v)
              if (has !== hs) {
                setSaveFlag(true)
                return;
              }
              setSaveFlag(false)
            }, 500)
            if (valueHasTimeout) {
              clearTimeout(valueHasTimeout);
            }
            setValueHasTimeout(timeout);

            setVal(v)
          }}/>
      </Modal>
    </>
  )
}
export default CodeEdit;
