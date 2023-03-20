import React, { ReactElement } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FormButton from 'components/atoms/FormButton'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'

import { COLOR, UTIL } from 'consts'

import { SbBuyNftDataType, SupportedNetworkEnum } from 'types'

import MediaRenderer from '../../atoms/MediaRenderer'
import useNftImage from 'hooks/independent/useNftImage'
import ChainLogoWrapper from '../../molecules/ChainLogoWrapper'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'

const BuyNftMessage = ({ data }: { data: SbBuyNftDataType }): ReactElement => {
  const { navigation } = useAppNavigation()

  const item = data.selectedNft
  const { uri } = useNftImage({
    nftContract: item.nftToken,
    tokenId: item.nftTokenId,
  })

  return (
    <View style={styles.container}>
      <ChainLogoWrapper
        chain={
          chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
          SupportedNetworkEnum.ETHEREUM
        }>
        <MediaRenderer src={uri} width={'100%'} height={150} />
      </ChainLogoWrapper>
      <View style={styles.body}>
        <Text style={{ color: COLOR.primary._400 }}>Bought NFT</Text>
        <Text
          numberOfLines={2}
          style={{
            color: 'black',
          }}>{`${UTIL.truncate(data.buyer)} bought #${item.nftTokenId}`}</Text>

        <FormButton
          size="sm"
          onPress={(): void => {
            navigation.navigate(Routes.NftDetail, {
              nftContract: item.nftToken,
              tokenId: item.nftTokenId,
            })
          }}>
          Details
        </FormButton>
      </View>
    </View>
  )
}

export default BuyNftMessage

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', width: 240 },
  body: { padding: 10, gap: 10 },
  priceBox: {
    backgroundColor: COLOR.primary._50,
    padding: 10,
    rowGap: 5,
    borderRadius: 10,
  },
  priceRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
