import { useAuthStore } from "../../stores/authStore ";
import GuestHeader from "./GuestHeader";
import UserHeader from "./UserHeader";


export default function Header() {

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return (
        <>
            {isAuthenticated ? <UserHeader /> : <GuestHeader />}
        </>
    );
}