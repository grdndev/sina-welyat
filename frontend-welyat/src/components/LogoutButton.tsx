import { LogOut } from "lucide-react";
import { useAuth } from "../middlewares/Auth";

export default function LogoutButton() {
    const { logout } = useAuth();

    return <button
     className="flex items-center justify-center rounded-lg bg-linear-to-r from-background-from to-background-to transition hover:from-background-from/80 hover:to-background-to/80 p-4 cursor-pointer"
     onClick={logout}>
        <LogOut />
    </button>
}