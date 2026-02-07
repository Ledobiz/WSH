// import { useEffect, useRef } from "react"

const FileViewer = ({fileUrl}: {fileUrl: string}) => {
    console.log("fileUrl", fileUrl);
    /*const viewer = useRef<any>(null);

    useEffect(() => {
        import('@pdftron/webviewer').then((module) => {
            const WebViewer = module.default;

            WebViewer(
                {
                    path: '/lib/webviewer',
                    initialDoc: fileUrl,
                },
                viewer.current,
            ).then((instance) => {
                const { documentViewer } = instance.Core;
                instance.UI.disableElements(['printButton', 'downloadButton', 'saveAsButton']);
            });
        });
    }, [fileUrl]);*/


    return (
        /*<div className="video-box webviewer" 
            ref={viewer}
            style={{width: "100%", height: "600px"}}
        />*/

        <div className="w-full h-[600px]">
            <iframe 
                src={fileUrl}
                className="w-full h-full"
            />
        </div>
    )
}
export default FileViewer