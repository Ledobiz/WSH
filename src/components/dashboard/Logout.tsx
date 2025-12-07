import { logout } from "@/src/services/auth"

const Logout = () => {
    return (
        <a href="#" onClick={logout} className="text-danger">
            <i className="bi bi-power me-2" />
            Logout
        </a>
    )
}
export default Logout