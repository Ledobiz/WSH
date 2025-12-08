import { logOut } from "@/src/services/core_auth"

const Logout = async () => {
    const handleLogout = () => {
        logOut();
    }

    return (
        <a href="#" onClick={handleLogout} className="text-danger">
            <i className="bi bi-power me-2" />
            Logout
        </a>
    )
}
export default Logout