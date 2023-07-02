import useReactQuery from 'hooks/complex/useReactQuery'
import useWeb3 from 'hooks/complex/useWeb3'
import { SupportedNetworkEnum } from 'palm-core/types'
import { useEffect, useState } from 'react'
import { Account } from 'web3-core'

export type UseCreateCompleteReturn = {
  account?: Account
  nonce?: number
}

const useCreateComplete = (): UseCreateCompleteReturn => {
  const { web3, getSigner } = useWeb3(SupportedNetworkEnum.ETHEREUM)

  const [account, setAccount] = useState<Account>()

  const { data: nonce } = useReactQuery(
    ['getTransactionCount', account?.address],
    async () => {
      if (account?.address) {
        return web3?.eth.getTransactionCount(account.address)
      }
    },
    {
      enabled: !!account?.address,
    }
  )

  useEffect(() => {
    getSigner().then(x => {
      setAccount(x)
    })
  }, [])

  return { account, nonce }
}

export default useCreateComplete
