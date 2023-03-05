import React, { ReactElement } from 'react'
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  ImageBackground,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { COLOR, UTIL } from 'consts'

import { Routes } from 'libs/navigation'
import {
  Card,
  Container,
  FormButton,
  Header,
  MediaRenderer,
  MoralisNftRenderer,
  Row,
} from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useUserNftList from 'hooks/api/useUserNftList'
import useUserBalance from 'hooks/independent/useUserBalance'
import useEthPrice from 'hooks/independent/useEthPrice'
import { pToken } from 'types'

const UserProfileScreen = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.UserProfile>()
  const userAddress = params.address

  const useUserNftListReturn = useUserNftList({
    userAddress,
  })
  const { balance, refetch } = useUserBalance({ address: userAddress })

  const { getEthPrice } = useEthPrice()
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={useUserNftListReturn.isRefetching}
          onRefresh={(): void => {
            useUserNftListReturn.refetch()
            refetch()
          }}
        />
      }>
      <Container style={styles.container}>
        <Header
          title={params.nickName || UTIL.truncate(userAddress)}
          left={
            <Icon name="ios-chevron-back" color={COLOR.gray._800} size={20} />
          }
          onPressLeft={navigation.goBack}
        />
        <ImageBackground
          blurRadius={10}
          imageStyle={{
            opacity: 0.7,
            borderBottomRightRadius: 30,
            borderBottomLeftRadius: 30,
          }}
          source={{ uri: params.plainProfileUrl }}
          style={styles.topSection}>
          <View style={styles.profileImgBox}>
            <MediaRenderer
              src={params.plainProfileUrl}
              width={100}
              height={100}
              style={{ borderRadius: 50 }}
            />
          </View>
          <View
            style={{
              padding: 20,
              alignItems: 'center',
              width: '100%',
            }}>
            <Card
              style={{
                width: 160,
                paddingHorizontal: 20,
                paddingVertical: 10,
                alignItems: 'center',
              }}>
              <Text style={{ color: 'black' }}>{params.nickName}</Text>
            </Card>
          </View>
          <Card
            style={{
              marginHorizontal: 10,
              padding: 20,
              rowGap: 20,
              marginBottom: -30,
            }}>
            <Row style={styles.walletBalanceBox}>
              <Row style={{ alignItems: 'center', columnGap: 10 }}>
                <View style={styles.walletIconBox}>
                  <Icon name="wallet" color={COLOR.primary._400} size={20} />
                </View>
                <View>
                  <Text style={{ color: 'black' }}>Wallet</Text>
                  <Text>{UTIL.truncate(userAddress)}</Text>
                </View>
              </Row>
              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLOR.primary._400,
                    fontWeight: 'bold',
                  }}>
                  {UTIL.formatAmountP(balance, { toFix: 4 })} ETH
                </Text>
                <Text style={{ fontSize: 12 }}>
                  $
                  {UTIL.formatAmountP(getEthPrice(balance || ('0' as pToken)), {
                    toFix: 0,
                  })}
                </Text>
              </View>
            </Row>
            <View
              style={{
                padding: 20,
                borderWidth: 1,
                borderColor: COLOR.gray._400,
                borderRadius: 20,
              }}>
              <Text>
                Hello, Everybody! 👋 I’m Bitcoin OG. And NFT Maximalist. Hello,
                Everybody! 👋 I’m Bitcoin OG. And NFT Maximalist.
              </Text>
            </View>
          </Card>
        </ImageBackground>
        <View style={styles.body}>
          <Row
            style={{
              width: '100%',
              backgroundColor: 'white',
              alignSelf: 'flex-start',
              padding: 5,
              borderRadius: 10,
              columnGap: 10,
            }}>
            <FormButton containerStyle={{ flex: 1 }} size="sm">
              Owned List
            </FormButton>
            <FormButton containerStyle={{ flex: 1 }} size="sm" disabled>
              Activate
            </FormButton>
          </Row>
          <FlatList
            data={useUserNftListReturn.nftList}
            keyExtractor={(_, index): string => `nftList-${index}`}
            numColumns={2}
            contentContainerStyle={{ gap: 10 }}
            columnWrapperStyle={{ gap: 10 }}
            scrollEnabled={false}
            renderItem={({ item }): ReactElement => (
              <TouchableWithoutFeedback
                onPress={(): void => {
                  navigation.navigate(Routes.NftDetail, {
                    nftContract: item.token_address,
                    tokenId: item.token_id,
                  })
                }}>
                <View style={{ borderRadius: 10, flex: 1 }}>
                  <MoralisNftRenderer item={item} width={'100%'} height={180} />
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        </View>
      </Container>
    </ScrollView>
  )
}

export default UserProfileScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.primary._100,
  },
  topSection: { marginBottom: 30, paddingTop: 30 },
  body: { gap: 10, padding: 10 },
  profileImgBox: {
    borderRadius: 999,
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  walletBalanceBox: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOR.primary._100,
    padding: 20,
    borderRadius: 20,
  },
  walletIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 999,
  },
  settingIcon: {
    margin: 10,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  nftTitle: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    alignSelf: 'center',
    bottom: 0,
    flex: 1,
  },
})
