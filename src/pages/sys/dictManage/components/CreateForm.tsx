import React from 'react';
import {Drawer} from 'antd';
import Settings from "../../../../../config/defaultSettings";

interface CreateFormProps {
  modalVisible: boolean;
  onClose: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const {modalVisible, onClose} = props;

  return (
    <Drawer
      destroyOnClose
      title="添加字典"
      width={Settings.form.drawer.width}
      visible={modalVisible}
      onClose={() => onClose()}
      footer={null}
    >
      {props.children}
    </Drawer>
  );
};

export default CreateForm;
