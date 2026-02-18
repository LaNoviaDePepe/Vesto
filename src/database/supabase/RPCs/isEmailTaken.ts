import { supabase } from "../Client";

export async function isEmailTaken(email: string): Promise<boolean> {

    const { data, error } = await supabase
        .rpc('check_email_exists', { p_email: email });

    if (error) {
        console.error("Error comprobando email:", error);
        return false;
    }

    const isTaken = data === true;
    return isTaken;
}