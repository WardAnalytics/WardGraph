import { QueryClient } from "react-query";

/**
 * A custom QueryClient with default options
 *
 * @example
 * const queryClient = useCustomQueryClient()
 *
 * @see https://react-query.tanstack.com/reference/QueryClient
 *
 * @see https://react-query.tanstack.com/guides/default-query-function
 *
 * @returns A custom QueryClient with default options
 */
const useCustomQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });
};

export default useCustomQueryClient;
