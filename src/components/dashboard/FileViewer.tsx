import { useEffect, useRef } from "react"

const FileViewer = ({fileUrl}: {fileUrl: string}) => {
    const viewer = useRef<any>(null);

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
                /*let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

                // Disable browser print shortcut (Ctrl/Cmd+P)
                keydownHandler = (e: KeyboardEvent) => {
                    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                };
                window.addEventListener('keydown', keydownHandler, true);*/
            });
        });

        /*return () => {
            if (keydownHandler) {
                window.removeEventListener('keydown', keydownHandler, true);
            }
        };*/
    }, [fileUrl]);


    return (
        <div className="video-box webviewer" 
            ref={viewer}
            style={{width: "100%", height: "600px"}}
        />
    )
}
export default FileViewer