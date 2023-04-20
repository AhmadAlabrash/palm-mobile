import React, { ReactElement, useEffect, useMemo } from 'react'
import { useGroupChannel } from '@sendbird/uikit-chat-hooks'
import { BackHandler, Platform } from 'react-native'
import {
  createGroupChannelFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native'
import type { SendbirdChatSDK } from '@sendbird/uikit-utils'
import { GroupChannel } from '@sendbird/chat/groupChannel'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

import { Routes } from 'libs/navigation'

import GroupChannelHeader from './GroupChannelHeader'
import GroupChannelInput from './GroupChannelInput'
import GroupChannelMessageList from './GroupChannelMessageList'
import { MessageRenderer } from 'components'
import useFsChannel from 'hooks/firestore/useFsChannel'
import { useAppNavigation } from 'hooks/useAppNavigation'
import ChannelGatingChecker from 'components/ChannelGatingChecker'

const GroupChannelFragment = createGroupChannelFragment({
  Input: GroupChannelInput,
  Header: GroupChannelHeader,
  MessageList: GroupChannelMessageList,
})

const HasGatingToken = (): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>()

  return (
    <ChannelGatingChecker
      channelUrl={params.channelUrl}
      onCompleteCheck={({ accessible }): void => {
        if (accessible === false) {
          navigation.replace(Routes.TokenGatingInfo, {
            channelUrl: params.channelUrl,
          })
        }
      }}
    />
  )
}

const Contents = ({
  channel,
  sdk,
  fsChannel,
}: {
  channel: GroupChannel
  sdk: SendbirdChatSDK
  fsChannel: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
}): ReactElement => {
  const { navigation, params } = useAppNavigation<Routes.GroupChannel>()

  const channelLeave = async (): Promise<boolean> => {
    // if there is no message in channel
    if (!channel.lastMessage) {
      await channel.leave()
      await sdk.clearCachedMessages([channel.url]).catch()
      await fsChannel.delete()
      return true
    }
    return false
  }

  const backAction = (): boolean => {
    channelLeave().then(res => {
      if (res === false) {
        navigation.goBack()
      }
    })
    return true
  }

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      )

      return () => {
        backHandler.remove()
      }
    } else {
      navigation.addListener('beforeRemove', channelLeave)

      return () => {
        navigation.removeListener('beforeRemove', channelLeave)
      }
    }
  }, [])

  return (
    <GroupChannelFragment
      channel={channel}
      onPressMediaMessage={(fileMessage, deleteMessage): void => {
        // Navigate to media viewer
        navigation.navigate(Routes.FileViewer, {
          serializedFileMessage: fileMessage.serialize(),
          deleteMessage,
        })
      }}
      onChannelDeleted={(): void => {
        // Should leave channel, navigate to channel list
        navigation.navigate(Routes.GroupChannelList)
      }}
      onPressHeaderLeft={backAction}
      onPressHeaderRight={(): void => {
        // Navigate to group channel settings
        navigation.push(Routes.GroupChannelSettings, params)
      }}
      renderMessage={(props): ReactElement | null => (
        <MessageRenderer {...props} />
      )}
    />
  )
}

const GroupChannelScreen = (): ReactElement => {
  const { params } = useAppNavigation<Routes.GroupChannel>()
  const { sdk } = useSendbirdChat()

  const { channel } = useGroupChannel(sdk, params.channelUrl)

  const { fsChannel, fsChannelField } = useFsChannel({
    channelUrl: params.channelUrl,
  })
  const gating = useMemo(() => fsChannelField?.gating, [fsChannelField])

  if (!channel || !fsChannel || !fsChannelField) {
    return <></>
  }

  return (
    <>
      {channel.myRole !== 'operator' && gating && <HasGatingToken />}
      <Contents channel={channel} sdk={sdk} fsChannel={fsChannel} />
    </>
  )
}

export default GroupChannelScreen
