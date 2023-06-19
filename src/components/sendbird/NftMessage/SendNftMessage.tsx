import FormText from 'components/atoms/FormText'
import UserMention from 'components/atoms/UserMention'
import VerifiedWrapper from 'components/molecules/VerifiedWrapper'
import MoralisNftRenderer from 'components/moralis/MoralisNftRenderer'
import { COLOR } from 'consts'
import useExplorer from 'hooks/complex/useExplorer'
import { useAppNavigation } from 'hooks/useAppNavigation'
import { Routes } from 'libs/navigation'
import { chainIdToSupportedNetworkEnum } from 'libs/utils'
import React, { ReactElement } from 'react'
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SbSendNftDataType, SupportedNetworkEnum } from 'types'

const SendNftMessage = ({
  data,
}: {
  data: SbSendNftDataType
}): ReactElement => {
  const { navigation } = useAppNavigation()

  const item = data.selectedNft

  const chain =
    chainIdToSupportedNetworkEnum(item.chainId || '0x1') ||
    SupportedNetworkEnum.ETHEREUM

  const { getLink } = useExplorer(chain)

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.body}
        onPress={(): void => {
          navigation.navigate(Routes.NftDetail, {
            nftContract: item.token_address,
            tokenId: item.token_id,
            nftContractType: item.contract_type,
            chain,
            item,
          })
        }}
      >
        <FormText
          fontType="R.12"
          numberOfLines={2}
          style={{
            color: 'black',
            paddingVertical: 9,
            paddingHorizontal: 12,
          }}
        >
          <UserMention userMetadata={data.from} />
          <FormText fontType="B.12">{` sent "${item.name || 'unknown'}" #${
            item.token_id
          }`}</FormText>
          {' to '}
          <UserMention userMetadata={data.to} />
        </FormText>
        <VerifiedWrapper>
          <MoralisNftRenderer
            item={item}
            width={'100%'}
            height={232}
            style={{
              borderRadius: 18,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              maxWidth: 'auto',
            }}
          />
        </VerifiedWrapper>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          alignSelf: 'flex-end',
          paddingTop: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={(): void => {
          Linking.openURL(
            getLink({
              address: data.txHash,
              type: 'tx',
            })
          )
        }}
      >
        <FormText color={COLOR.black._500} fontType="R.12">
          View Transaction Detail{' '}
        </FormText>
        <Ionicons
          color={COLOR.black._500}
          name="ios-chevron-forward"
          size={14}
        />
      </TouchableOpacity>
    </View>
  )
}

export default SendNftMessage

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', width: 240 },
  body: { borderWidth: 1, borderColor: COLOR.black._90010, borderRadius: 18 },
})
