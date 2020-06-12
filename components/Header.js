import React from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'


function Header(props) {
   return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Tic Tac Toe
        </Text>
      </View>
    )
}

export default  Header;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: 'skyblue',
    flexDirection: 'row'
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 23,
    textAlign: 'center',
    margin: 10,
  }
})
