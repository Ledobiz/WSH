interface ButtonLoaderProps {
    color?: string;
}

const ButtonLoader = ({ color = '#6a1b9a' }: ButtonLoaderProps) => {
    return (
        <div className="spinner-border" style={{color}} role="status">
            <span className="sr-only">Processing, please wait...</span>
        </div>
    )
}
export default ButtonLoader