import React, { ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'

import { COLOR } from 'consts'
import { FormText } from 'components'

const Tag = ({ title }: { title: string }): ReactElement => {
  return (
    <View style={styles.item}>
      <FormText fontType="SB.14" color={COLOR.black._500}>
        #{title}
      </FormText>
    </View>
  )
}

export default Tag

const styles = StyleSheet.create({
  item: {
    backgroundColor: COLOR.black._50,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
})
