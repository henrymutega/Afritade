import { supabase } from "@/integrations/supabase/client";

export const testConnection = async () => {
  const { data, error } = await supabase.from("user_roles").select("*");
  console.log(data, error);
};
