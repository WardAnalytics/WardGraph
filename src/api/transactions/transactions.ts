/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * compliance-queries-api
 * The ward's compliance queires endpoints
 * OpenAPI spec version: 1.0
 */
import {
  useQuery
} from 'react-query'
import type {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult
} from 'react-query'
import type {
  GetTransactions200
} from '../model/getTransactions200'
import type {
  GetTransactionsParams
} from '../model/getTransactionsParams'
import { instance } from '.././instance';



/**
 * Get transactions for an address
 */
export const getTransactions = (
    address: string,
    params?: GetTransactionsParams,
 signal?: AbortSignal
) => {
      
      
      return instance<GetTransactions200>(
      {url: `/addresses/${address}/transactions`, method: 'GET',
        params, signal
    },
      );
    }
  

export const getGetTransactionsQueryKey = (address: string,
    params?: GetTransactionsParams,) => {
    return [`/addresses/${address}/transactions`, ...(params ? [params]: [])] as const;
    }

    
export const getGetTransactionsQueryOptions = <TData = Awaited<ReturnType<typeof getTransactions>>, TError = unknown>(address: string,
    params?: GetTransactionsParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getTransactions>>, TError, TData>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetTransactionsQueryKey(address,params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getTransactions>>> = ({ signal }) => getTransactions(address,params, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(address), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getTransactions>>, TError, TData> & { queryKey: QueryKey }
}

export type GetTransactionsQueryResult = NonNullable<Awaited<ReturnType<typeof getTransactions>>>
export type GetTransactionsQueryError = unknown

export const useGetTransactions = <TData = Awaited<ReturnType<typeof getTransactions>>, TError = unknown>(
 address: string,
    params?: GetTransactionsParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getTransactions>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = getGetTransactionsQueryOptions(address,params,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



