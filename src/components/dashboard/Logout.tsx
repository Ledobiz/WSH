import { logOut } from "@/src/services/auth"

type LogoutProps = {
    style?: React.CSSProperties;
};

const Logout = async ({style}: LogoutProps) => {
    const handleLogout = () => {
        logOut();
    }

    return (
        <button onClick={handleLogout} style={style} className="text-danger logout">
            <i className="bi bi-power me-2" />
            Logout
        </button>
    )
}
export default Logout