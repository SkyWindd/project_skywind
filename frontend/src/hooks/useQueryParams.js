import { useSearchParams } from "react-router-dom";

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParam = (key, value) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  const removeParam = (key) => {
    searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const clearAll = () => {
    setSearchParams({});
  };

  return { searchParams, setParam, removeParam, clearAll };
}
