import React, {useEffect, useState} from 'react';
import {Avatar, message, Upload} from 'antd';
import {LoadingOutlined, PlusOutlined, UserOutlined} from "@ant-design/icons";
import ImgCrop from 'antd-img-crop';

interface Props {
  avatarUrl?: any;
  onUploadBack: (arg0: any) => void;
  action: string;
}

function getBase64(img: any, callback: (obj: any) => any) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file: any) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const UploadAvatar: React.FC<Props> = (props) => {
  const {avatarUrl, onUploadBack, action} = props;
  const [loading, setLoading] = useState<boolean>();
  const [imageUrl, setImageUrl] = useState<any>();
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined/> : <PlusOutlined/>}
      <div style={{marginTop: 8}}>Upload</div>
    </div>
  );
  const avatar = (
    <Avatar style={{width: "100%", height: "100%"}}
            shape="circle" size={64} icon={<UserOutlined/>}
            src={imageUrl}/>
  )

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        setImageUrl(imageUrl);
        setLoading(false);
      })
    }
  }
  useEffect(() => {
    if (avatarUrl) {
      setImageUrl(avatarUrl)
    }
  }, [])

  return (
    <ImgCrop shape='round' rotate>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={action}
        beforeUpload={beforeUpload}
        onChange={(e) => {
          const {response, status} = e.file;
          if (status === "done") {
            onUploadBack(response);
          }
          handleChange(e)
        }}
      >
        {imageUrl ? avatar : uploadButton}
      </Upload>
    </ImgCrop>
  );
};

export default UploadAvatar;
