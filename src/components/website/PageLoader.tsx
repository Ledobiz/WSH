const PageLoader = () => {
    return (
        <div 
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh", width: "100%" }}
        >
            <div className="spinner-border text-lg spinner" style={{width: '5rem', height: '5rem', color: '#6a1b9a'}} role="status">
                <span className="visually-hidden">Processing, please wait...</span>
            </div>
        </div>
    )
}
export default PageLoader