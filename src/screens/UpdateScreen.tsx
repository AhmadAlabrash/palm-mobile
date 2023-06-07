import { FormImage, FormText } from 'components'
import { COLOR } from 'consts'
import React, { ReactElement, useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

import images from 'assets/images'
import useInterval from 'hooks/useInterval'
import RNBootSplash from 'react-native-bootsplash'

const updateMessage =
  'There are app updates.\nPlease wait until the update is complete.'
const completeMessage = 'Update completed.\nPalm app will be restarted.'
const dots = ['', '.', '..']

const UpdateScreen = (props: {
  restartApp: (onlyIfUpdateIsPending?: boolean) => void
  syncUpdate: () => Promise<void>
  upToDate: boolean | undefined
  updateComplete: boolean | undefined
}): ReactElement => {
  const { restartApp, upToDate, updateComplete } = props

  const [dotsIndex, setDotsIndex] = useState(0)

  useInterval(() => {
    setDotsIndex((dotsIndex + 1) % dots.length)
  }, 500)

  useEffect(() => {
    if (upToDate === false) {
      RNBootSplash.getVisibilityStatus().then(visibility => {
        visibility === 'visible' &&
          RNBootSplash.hide({ fade: true, duration: 500 })
      })
    }
  }, [upToDate])

  useEffect(() => {
    if (updateComplete) {
      restartApp()
    }
  }, [updateComplete])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLOR.white,
        justifyContent: 'center',
      }}
    >
      {upToDate === undefined ? (
        <ActivityIndicator size="small" color={COLOR.primary._400} />
      ) : (
        <>
          <FormImage
            source={images.palm_logo}
            size={74}
            style={{ alignSelf: 'center', margin: 22 }}
          />
          <FormText
            fontType="R.14"
            color={COLOR.black._400}
            style={{ textAlign: 'center' }}
          >
            {updateComplete
              ? completeMessage
              : `${updateMessage}${dots[dotsIndex]}`}
          </FormText>
        </>
      )}
    </View>
  )
}

export default UpdateScreen
