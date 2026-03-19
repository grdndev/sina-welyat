import { LogOut } from "lucide-react";
import { useAuth } from "../middlewares/Auth";

export default function LogoutButton() {
    const { logout } = useAuth();

    return <button
     className="flex items-center justify-center rounded-lg bg-gray-500/30 transition hover:bg-gray-500/50 p-4 cursor-pointer"
     onClick={logout}>
        <LogOut />
    </button>
}