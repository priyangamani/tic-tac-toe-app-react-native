import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'

import {
  GAME_RESULT_NO,
  GAME_RESULT_USER,
  GAME_RESULT_AI,
  GAME_RESULT_TIE
} from './constant/game'


function PromptArea(props) {
 const { result, onRestart } = props;
   const generateResultText = (result: number) =>{
       switch (result) {
      case GAME_RESULT_USER:
        return 'You won the game!'
      case GAME_RESULT_AI:
        return 'AI won the game!'
      case GAME_RESULT_TIE:
        return 'Tie!'
      default:
        return ''
    }
   }
      return (
      <View>
        <Text style={styles.text}>{ generateResultText(result) }</Text>
        {
          result !== GAME_RESULT_NO && (
            <TouchableOpacity onPress={() => onRestart()}>
              <Text style={styles.instructions}>
                Touch here to play again
              </Text>
            </TouchableOpacity>
          )
        }
      </View>
    )
}


export default PromptArea;


const styles = StyleSheet.create({
  text: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  instructions: {
    marginTop: 20,
    color: 'grey',
    marginBottom: 5,
    textAlign: 'center'
  },
})