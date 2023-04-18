import React, { ReactElement, useState } from 'react'
import {
  StyleSheet,
  FlatList,
  View,
  Pressable,
  TouchableOpacity,
} from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import Icon from 'react-native-vector-icons/Ionicons'
import { useAlert } from '@sendbird/uikit-react-native-foundation'
import { useAsyncEffect } from '@sendbird/uikit-utils'

import { COLOR, UTIL } from 'consts'
import { ContractAddr, SupportedNetworkEnum, pToken } from 'types'
import images from 'assets/images'

import { Routes } from 'libs/navigation'
import { FormImage, FormText, MediaRenderer, Row } from 'components'
import { useAppNavigation } from 'hooks/useAppNavigation'
import useEthPrice from 'hooks/independent/useEthPrice'
import { getProfileImgFromProfile } from 'libs/lens'
import useUserBalance from 'hooks/independent/useUserBalance'
import SupportedNetworkRow from './molecules/SupportedNetworkRow'
import useAuth from 'hooks/independent/useAuth'
import _ from 'lodash'
import useProfile from 'hooks/independent/useProfile'
import useKlayPrice from 'hooks/independent/useKlayPrice'
import useMaticPrice from 'hooks/independent/useMaticPrice'

const ProfileHeader = ({
  userAddress,
  userProfileId,
  isMyPage,
  selectedNetwork,
  onNetworkSelected,
}: {
  userAddress?: ContractAddr
  userProfileId?: string
  isMyPage: boolean
  selectedNetwork: SupportedNetworkEnum
  onNetworkSelected?: (selectedNetwork: SupportedNetworkEnum) => void
}): ReactElement => {
  const { navigation } = useAppNavigation()
  const { getEthPrice } = useEthPrice()
  const { getKlayPrice } = useKlayPrice()
  const { getMaticPrice } = useMaticPrice()
  const { alert } = useAlert()
  const { fetchUserProfileId } = useAuth()

  const { balance: ethBalance } = useUserBalance({
    address: userAddress,
    chain: SupportedNetworkEnum.ETHEREUM,
  })
  const { balance: klayBalance } = useUserBalance({
    address: userAddress,
    chain: SupportedNetworkEnum.KLAYTN,
  })
  const { balance: maticBalance } = useUserBalance({
    address: userAddress,
    chain: SupportedNetworkEnum.POLYGON,
  })

  const [profileId, setProfileId] = useState<string | undefined>(userProfileId)
  const { profile } = useProfile({ profileId })
  const profileImg = getProfileImgFromProfile(profile)

  useAsyncEffect(async () => {
    if (profileId || !userAddress) {
      return
    }
    try {
      const fetchedProfileId = await fetchUserProfileId(userAddress)
      setProfileId(fetchedProfileId)
    } catch (e) {
      console.error(e)
      alert({ title: 'Unknown Error', message: _.toString(e) })
      if (navigation.canGoBack()) {
        navigation.goBack()
      }
    }
  }, [userAddress])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isMyPage ? (
          <View style={{ alignItems: 'flex-end' }}>
            <Pressable
              style={styles.headerButton}
              onPress={(): void => {
                navigation.navigate(Routes.Setting)
              }}>
              <Icon name={'settings-outline'} size={24} />
            </Pressable>
          </View>
        ) : (
          <View style={{ alignItems: 'flex-start' }}>
            <Pressable
              style={styles.headerButton}
              onPress={(): void => {
                navigation.goBack()
              }}>
              <Icon
                name="ios-chevron-back"
                color={COLOR.black._800}
                size={24}
              />
            </Pressable>
          </View>
        )}
      </View>
      <View style={{ backgroundColor: 'white', paddingHorizontal: 20 }}>
        <View style={styles.profileImgBox}>
          {profileImg ? (
            <MediaRenderer
              src={profileImg}
              width={100}
              height={100}
              style={{ borderRadius: 50 }}
            />
          ) : (
            <FormImage
              source={images.profile_temp}
              size={100}
              style={{ borderRadius: 50 }}
            />
          )}
        </View>

        <View style={styles.section}>
          <FormText fontType="B.20">{profile?.handle}</FormText>
        </View>
        <View style={styles.section}>
          <TouchableOpacity
            onPress={(): void => {
              if (!userAddress) {
                return
              }
              alert({ title: 'Address copied', message: userAddress })
              Clipboard.setString(userAddress)
            }}>
            <Row style={{ alignItems: 'center', columnGap: 10 }}>
              <Icon name="wallet" color={COLOR.primary._400} size={20} />
              <View>
                <FormText>{UTIL.truncate(userAddress || '')}</FormText>
              </View>
            </Row>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <FormText fontType="R.12" color={COLOR.black._200}>
            User profile description User profile description User profile
            description User profile description User profile description User
            profile description User profile description User profile
            description User profile description User profile description
          </FormText>
        </View>
        <Row style={{ alignItems: 'center', columnGap: 8 }}>
          <Row>
            <FormText fontType="R.12">Followers</FormText>
            <FormText fontType="B.12">123k</FormText>
          </Row>
          <FormText fontType="R.12">∙</FormText>
          <Row>
            <FormText fontType="R.12">Following</FormText>
            <FormText fontType="B.12">123k</FormText>
          </Row>
          <FormText fontType="R.12">∙</FormText>
          <Row>
            <FormText fontType="R.12">NFT</FormText>
            <FormText fontType="B.12">123,456</FormText>
          </Row>
        </Row>
        <View style={styles.walletBalanceBox}>
          <Row
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 12,
            }}>
            <FormText fontType="B.14">My Balance</FormText>
            <FormText fontType="R.10" color={COLOR.black._200}>
              Only visible to you
            </FormText>
          </Row>
          <View style={{ rowGap: 8 }}>
            <View style={styles.balanceItemCard}>
              <Row style={{ alignItems: 'center', columnGap: 12 }}>
                <FormImage source={images.eth_logo} size={28} />
                <View>
                  <Row>
                    <FormText fontType="B.16">
                      {UTIL.formatAmountP(ethBalance || ('0' as pToken), {
                        toFix: 4,
                      })}{' '}
                    </FormText>
                    <FormText fontType="R.16">ETH</FormText>
                  </Row>
                  <FormText fontType="R.10" color={COLOR.black._400}>
                    {`(≈$${UTIL.formatAmountP(
                      getEthPrice(ethBalance || ('0' as pToken)),
                      {
                        toFix: 0,
                      }
                    )})`}
                  </FormText>
                </View>
              </Row>
            </View>
            <View style={styles.balanceItemCard}>
              <Row style={{ alignItems: 'center', columnGap: 12 }}>
                <FormImage source={images.klay_logo} size={28} />
                <View>
                  <Row>
                    <FormText fontType="B.16">
                      {UTIL.formatAmountP(klayBalance || ('0' as pToken), {
                        toFix: 4,
                      })}{' '}
                    </FormText>
                    <FormText fontType="R.16">KLAY</FormText>
                  </Row>
                  <FormText fontType="R.10" color={COLOR.black._400}>
                    {`(≈$${UTIL.formatAmountP(
                      getKlayPrice(klayBalance || ('0' as pToken)),
                      {
                        toFix: 0,
                      }
                    )})`}
                  </FormText>
                </View>
              </Row>
            </View>
            <View style={styles.balanceItemCard}>
              <Row style={{ alignItems: 'center', columnGap: 12 }}>
                <FormImage source={images.matic_logo} size={28} />
                <View>
                  <Row>
                    <FormText fontType="B.16">
                      {UTIL.formatAmountP(maticBalance || ('0' as pToken), {
                        toFix: 4,
                      })}{' '}
                    </FormText>
                    <FormText fontType="R.16">MATIC</FormText>
                  </Row>
                  <FormText fontType="R.10" color={COLOR.black._400}>
                    {`(≈$${UTIL.formatAmountP(
                      getMaticPrice(maticBalance || ('0' as pToken)),
                      {
                        toFix: 0,
                      }
                    )})`}
                  </FormText>
                </View>
              </Row>
            </View>
          </View>
        </View>
        {!!profile?.attributes?.length && (
          <View
            style={{
              padding: 6,
            }}>
            <FlatList
              data={profile.attributes}
              keyExtractor={(item, index): string =>
                `profile-attribute-${index}`
              }
              horizontal
              contentContainerStyle={{
                gap: 20,
                marginHorizontal: '5%',
              }}
              renderItem={({
                item,
              }: {
                item: { key: string; value: string }
              }): ReactElement | null =>
                item.key === 'app' ? null : (
                  <View
                    style={{
                      marginHorizontal: 15,
                      alignItems: 'center',
                    }}>
                    <FormText style={styles.attribute}>{item.key}</FormText>
                    <FormText>{item.value}</FormText>
                  </View>
                )
              }
            />
          </View>
        )}
        <View style={{ paddingTop: 32, rowGap: 12, paddingBottom: 12 }}>
          <FormText fontType="B.14">NFT List</FormText>
          <SupportedNetworkRow
            selectedNetwork={selectedNetwork}
            onNetworkSelected={onNetworkSelected}
          />
        </View>
      </View>
    </View>
  )
}

export default ProfileHeader

const styles = StyleSheet.create({
  container: { backgroundColor: 'white' },
  header: {
    height: 168,
    backgroundColor: `${COLOR.black._900}${COLOR.opacity._10}`,
  },
  profileImgBox: {
    borderRadius: 999,
    marginTop: -88,
  },
  section: {
    paddingBottom: 12,
  },
  bioCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: COLOR.black._400,
    borderRadius: 20,
  },
  walletBalanceBox: { paddingTop: 32 },
  balanceItemCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: `${COLOR.black._900}${COLOR.opacity._05}`,
    borderRadius: 16,
  },
  headerButton: {
    margin: 10,
    padding: 5,
  },
  attribute: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  rowButtons: {
    width: '100%',
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: 10,
    columnGap: 10,
  },
})
