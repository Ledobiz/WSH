import { RPProvider, RPDefaultLayout, RPPages, RPConfig } from '@pdf-viewer/react'

const FileViewer = ({fileUrl}: {fileUrl: string}) => {
    return (
        <RPConfig>
            <RPProvider src={fileUrl}>
                <RPDefaultLayout style={{ height: '600px', width: '100%' }}>
                    <RPPages />
                </RPDefaultLayout>
            </RPProvider>
        </RPConfig>
    )
}
export default FileViewer