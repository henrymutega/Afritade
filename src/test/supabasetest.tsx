import { supabase } from "../lib/supabase";

export const testConnection = async () => {
  const { data, error } = await supabase.from("test").select("*");
  console.log(data, error);
};
