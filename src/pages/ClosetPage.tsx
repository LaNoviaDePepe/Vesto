import { useEffect, useState } from "react";
import Filter from "../components/filter/Filter";
import PrendasLayout from "../layouts/PrendasLayout";
import { SupabaseItemRepository } from "../database/supabase/SupabaseItemRepository";
import { useAuthStore } from "../stores/authStore";


export default function ClosetPage() {
  
  const [prendas, setPrendas] = useState([]);
  const itemRepository = new SupabaseItemRepository();
  const { sessionUser } = useAuthStore();

  useEffect(() => {
    if (!sessionUser) return;

    const loadPrendas = async () => {
      const { data, error } = await itemRepository.getPrendas(
        sessionUser.user.id
      );

      if (error) {
        console.error(error);
        return;
      }

      setPrendas(data ?? []);
    };

    loadPrendas();
  }, [sessionUser]);


  return (
    <>
      <Filter width={100} />
      <PrendasLayout prendas={prendas || []} />
    </>
  );
}
