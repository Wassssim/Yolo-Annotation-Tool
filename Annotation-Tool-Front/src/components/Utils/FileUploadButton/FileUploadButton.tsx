import { FC, PropsWithChildren, useRef } from "react";

interface FileUploadButtonProps {
    onFileUpload: (files: File[]) => void,
}

const FileUploadButton: FC<PropsWithChildren<FileUploadButtonProps>> = ({ onFileUpload, children }) => {
    const hiddenFileInputRef = useRef<HTMLInputElement>(null);
    
    const handleChange = (event: any) => {
        onFileUpload(event.target.files);
    }

    const handleClick = (_: any) => {
        hiddenFileInputRef.current?.click();
    };

    return(
        <>
            <input 
                type="file"
                style={{display: "none"}}
                onChange={handleChange}
                multiple={true}
                ref={hiddenFileInputRef}
            ></input>
            <button onClick={handleClick}>{children}</button>
        </>
    )
}

export default FileUploadButton;