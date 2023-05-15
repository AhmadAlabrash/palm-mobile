import { FbProfile, FirestoreKeyEnum } from 'types'

import firestore from '@react-native-firebase/firestore'
import useReactQuery from 'hooks/complex/useReactQuery'

export type UseFsProfilesReturn = {
  fsProfileList: FbProfile[]
}

const useFsProfiles = (): UseFsProfilesReturn => {
  const limit = 5
  const { data: fsProfileList = [] } = useReactQuery(
    [FirestoreKeyEnum.Profiles],
    async () => {
      const list: FbProfile[] = []
      await firestore()
        .collection('profiles')
        .limit(limit)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            list.push(documentSnapshot.data() as FbProfile)
          })
        })

      return list
    }
  )

  return {
    fsProfileList,
  }
}

export default useFsProfiles
