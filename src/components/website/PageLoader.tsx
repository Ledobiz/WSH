const PageLoader = () => {
    return (
        <div 
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh", width: "100%" }}
        >
            <div className="spinner-border text-primary text-lg" role="status">
                <span className="visually-hidden">Processing, please wait...</span>
            </div>
        </div>
    )
}
export default PageLoader