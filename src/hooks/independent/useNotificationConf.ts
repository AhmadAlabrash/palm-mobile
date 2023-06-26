import { AuthorizationStatus } from '@notifee/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'
import { UTIL } from 'consts'
import { LocalStorageKey } from 'types'

const useNotificationConf = (): {
  isEnableNotification: () => Promise<boolean>
  setEnableNotification: (enable: boolean) => Promise<void>
  checkNotificationPermission: (
    providesAppNotificationSettings: boolean
  ) => Promise<boolean>
} => {
  const isEnableNotification = async (): Promise<boolean> => {
    const pushEnable = await AsyncStorage.getItem(
      LocalStorageKey.PUSH_NOTIFICATION
    )

    if (pushEnable === null) {
      await setEnableNotification(true)
      return true
    }

    return UTIL.toBoolean(pushEnable)
  }

  const setEnableNotification = async (enable: boolean): Promise<void> => {
    await AsyncStorage.setItem(
      LocalStorageKey.PUSH_NOTIFICATION,
      enable.toString()
    )
  }

  const checkNotificationPermission = async (
    providesAppNotificationSettings: boolean
  ): Promise<boolean> => {
    const authorizationStatus = await messaging().requestPermission({
      providesAppNotificationSettings,
    })

    return authorizationStatus !== AuthorizationStatus.AUTHORIZED &&
      authorizationStatus !== AuthorizationStatus.PROVISIONAL
      ? false
      : true
  }

  return {
    isEnableNotification,
    setEnableNotification,
    checkNotificationPermission,
  }
}

export default useNotificationConf
