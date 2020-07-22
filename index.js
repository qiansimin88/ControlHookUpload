
import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import {
    DragDropContext,
    Draggable,
    DraggingStyle,
    Droppable,
    DropResult,
    NotDraggingStyle
  } from 'react-beautiful-dnd';
import UploadList from 'antd/es/upload/UploadList';
import { Input, Icon, Modal, Upload } from 'antd';
import { getUploadSignature } from './req'
import { getImageShowUrl, returnOssUrl } from './util.js'
/**
 * 可以被 form 接收的 upload
 * @param {*} props 
 * @param {string} rule : init: 整数  float: 浮点数 
 */
const ControlUploadForForm = ({
    listType = 'picture-card',
    typeCode,
    fileList = [],  // 上传的文件列表
    maxNum = 1,  // 最大上传数
    onChange,  // 给 form 接收的 change 事件   因为 upload 组件的值是 fileList 而不思 value 所有 父组件的 from 用valuePropName：filelist设置，
    beforeUpload,
    ...props
             // 用getValueFromEvent 来接收 当前组件的 upload  onChange 事件
}) => {
    const [prew, setPrew] = useState({
        visible: false,
        image: ''
    })

    const [uploadInfo, setUploadInfo] = useState({}) // 上传 hook 信息

    const handlePreview = useCallback(file => {
        const waitFile = async () => {
            const url = await getImageShowUrl(file)
            setPrew({
                visible: true,
                image: url
            })
        }
        waitFile()
    }, [])

    const uploadButton = (
        <>
            <Icon type="plus" />
            <div className="ant-upload-text">上传</div>
        </>
    )

    const beforeUploadHandler = async (file) => {
        let beforeResult = true
        let allResult = false
        if (beforeUpload && typeof beforeUpload === 'function') {
            const o = await beforeUpload(file)
            if (o === false) {
                beforeResult = false
            }
        }

        if ( !beforeResult ) return Promise.reject(new Error(false))

        const signResult = await getUploadSignature({
            method: 'POST',
            typeCode,
            resourceName: file.name,
            createTask: false,
            operator: localStorage.employeeId || '123456789',
        }).then(res => {
            if (res && res.entry) {
                const r = res.entry
                setUploadInfo({
                    ...r,
                    'OSSAccessKeyId': r.accessId,
                    'success_action_status': '200'
                })
                return Promise.resolve(true)
            } 
            return Promise.reject(new Error(res.message))
        })
        allResult = signResult && beforeResult
        if (allResult) {
            return Promise.resolve(file)
        }
        return Promise.reject(new Error(false))
    }

    const wrapOnChange = useCallback((e) => {
        const { file, fileList: nowfileList } = e
        const { status } = file

        if ( status === 'done' && file ) {
            const { key } = uploadInfo
            const imgUrl = returnOssUrl(key)
            nowfileList[nowfileList.length - 1].url = imgUrl
            onChange(nowfileList)
        }
        onChange(nowfileList)
    }, [onChange, uploadInfo])

    const handleMove = useCallback((file) => {
        wrapOnChange({
            file: { ...file, status: 'removed' },
            fileList: fileList.filter(_ => _.uid !== file.uid)
        })
    }, [fileList, wrapOnChange])


    const listStyle = useMemo(() => {
        return {
            display: 'flex',
            flexWrap: 'wrap',
            overflow: 'auto',
        }
    }, [])

    // 调换位置
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onDragEnd = useCallback(({ source, destination }) => {
        if (!destination) {
            return;
        }
        const newFileList = reorder(
            fileList,
            source.index,
            destination.index
        )
        wrapOnChange({ fileList: newFileList, file: {status: 'reorder'} });
    }, [fileList, wrapOnChange])

    useEffect(() => {
        if (!typeCode) {
            throw new Error('upload 组件 typecode 必须要传')
        }
    }, [typeCode])

    return (
        <>
            {
                fileList && (
                    <DragDropContext onDragEnd = {onDragEnd}>
                        <Droppable droppableId="droppable" direction='horizontal'>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    style = {listStyle}
                                >
                                    {
                                        fileList.map((o, i) => (
                                            <Draggable
                                                key = {o.uid}
                                                draggableId = {o.uid}
                                                index = {i}
                                            >
                                                {(provideds, snapshots) => (
                                                    <div
                                                        ref={provideds.innerRef}
                                                        {...provideds.draggableProps}
                                                        {...provideds.dragHandleProps}
                                                        style={{...provideds.draggableProps.style}}
                                                    >
                                                         <UploadList
                                                            showDownloadIcon={false}
                                                            listType={listType}
                                                            onPreview={handlePreview}
                                                            locale={{ previewFile: '预览', removeFile: '删除' }}
                                                            onRemove={handleMove}
                                                            items={[o]}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))
                                    }
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )
            }
              <Upload
                {...props}
                action={uploadInfo.host}
                data={uploadInfo}
                listType={listType}
                fileList={fileList}
                name="file"
                onChange={wrapOnChange}
                beforeUpload={beforeUploadHandler}
                showUploadList={false}
            >
                {fileList.length >= maxNum ? null : uploadButton}
            </Upload>
            <Modal visible={prew.visible} footer={null} onCancel={() => setPrew({image: '', visible: false})}>
                <img alt="example" style={{ width: '100%' }} src={prew.image} />
            </Modal>
        </>
    )
}

export default memo(
    ControlUploadForForm
)