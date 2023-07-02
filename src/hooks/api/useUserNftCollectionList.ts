import _ from 'lodash'
import { UTIL } from 'palm-core/libs'
import apiV1Fabricator from 'palm-core/libs/apiV1Fabricator'
import { recordError } from 'palm-core/libs/logger'
import {
  ApiEnum,
  ContractAddr,
  Moralis,
  SupportedNetworkEnum,
} from 'palm-core/types'
import { useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'

import useApi from '../complex/useApi'
import useNetwork from '../complex/useNetwork'
import { UseUserAssetsReturn } from './useUserNftList'

const useUserNftCollectionList = ({
  selectedNetwork,
  userAddress,
  limit,
}: {
  selectedNetwork: SupportedNetworkEnum
  userAddress?: ContractAddr
  limit?: number
}): UseUserAssetsReturn<Moralis.NftCollection> => {
  const { connectedNetworkIds } = useNetwork()
  const connectedNetworkId = connectedNetworkIds[selectedNetwork]
  const { getApi } = useApi()

  const {
    data,
    fetchNextPage,
    hasNextPage = false,
    refetch,
    remove,
    isLoading,
    isFetchingNextPage,
    isRefetching,
  } = useInfiniteQuery(
    [ApiEnum.COLLECTIONS, userAddress, connectedNetworkId],
    async ({ pageParam = '' }) => {
      if (userAddress) {
        const path = apiV1Fabricator[ApiEnum.COLLECTIONS].get({
          userAddress,
          connectedNetworkId,
          limit,
          cursor: pageParam,
        })

        const fetchResult = await getApi<ApiEnum.COLLECTIONS>({ path })
        if (fetchResult.success) {
          return fetchResult.data
        } else {
          recordError(new Error(fetchResult.errMsg), 'useUserNftCollectionList')
        }
      }
      return {
        page: 0,
        page_size: 0,
        cursor: null,
        result: [] as Moralis.NftCollection[],
      }
    },
    {
      getNextPageParam: lastPage => lastPage.cursor,
      enabled: !!userAddress,
    }
  )

  const items = useMemo(
    () =>
      _.flatten(data?.pages.map(x => x.result)).filter(
        x =>
          !!x &&
          !(UTIL.isMainnet() && x.possible_spam === true) &&
          !x.name?.includes('-Follower') &&
          !x.name?.includes('Dispatch-Messaging')
      ),
    [data]
  )

  const loading = useMemo(
    () => isLoading || isFetchingNextPage,
    [isLoading, isFetchingNextPage]
  )

  return {
    items,
    fetchNextPage,
    hasNextPage,
    refetch,
    remove,
    loading,
    isRefetching,
  }
}

export default useUserNftCollectionList
