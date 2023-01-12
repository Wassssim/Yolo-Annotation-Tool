import { FC, ReactNode, useRef } from "react";

type FileUploadButtonProps = {
    onFileUpload: (files: File[]) => void,
}

const FileUploadButton: FC<FileUploadButtonProps> = ({ onFileUpload, children }) => {
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
                ref={hiddenFileInputRef}
            ></input>
            <button onClick={handleClick}>{children}</button>
        </>
    )
}

export default FileUploadButton;