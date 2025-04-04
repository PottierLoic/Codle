import useSWR from 'swr';
import { supabase } from '@/lib/supabase';
import { Language } from '@/entities/Language';

const fetchLanguages = async (): Promise<Language[]> => {
  const { data, error } = await supabase
    .from("language")
    .select("id, name, icon")
    .order("name");

  if (error) throw new Error(error.message);
  return data as Language[];
};

export default function useLanguages() {
  const { data, error, isLoading } = useSWR('languages', fetchLanguages, {
    revalidateOnFocus: true,
    dedupingInterval: 1000 * 60 * 5,
  });

  return {
    languages: data ?? [],
    loading: isLoading,
    error,
  };
}
