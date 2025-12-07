const ErrorMessage = ({ errors }: { errors?: string[]}) => {
    if (!errors || errors.length === 0) return null;
    return <p className='text-danger font-bold'>{errors[0]}</p>;
}
export default ErrorMessage