import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, Alert, Text } from 'react-native';

import Circle from './Circle';
import Cross from './Cross';
import {
  CONDITIONS,
  GAME_RESULT_NO,
  GAME_RESULT_USER,
  GAME_RESULT_AI,
  GAME_RESULT_TIE,
  AWS_CENTER_POINTS_URL,
  AWS_AREA_URL
} from './constant/game';
import styles from './style/game';
import PromptArea from './PromptArea';
import axios from 'axios';

export default class GameBoard extends Component {
  state: {
    AIInputs: number[],
    userInputs: number[],
    result: number,
    round: number,
  };

  constructor() {
    super();
    this.state = {
      AIInputs: [],
      userInputs: [],
      result: GAME_RESULT_NO,
      round: 0,
      centrePointsVal: [],
      areaInput:[],
    };
  }

  restart() {
    const { round } = this.state;
    this.setState({
      userInputs: [],
      AIInputs: [],
      result: GAME_RESULT_NO,
      round: round + 1,
    });
    setTimeout(() => {
      if (round % 2 === 0) {
        this.AIAction();
      }
    }, 5);
  }

  boardClickHandler(e: Object) {
    const { locationX, locationY } = e.nativeEvent;
    const { userInputs, AIInputs, result } = this.state;
    if (result !== -1) {
      return;
    }
    const inputs = userInputs.concat(AIInputs);

    const area = this.state.areaInput.length!=0 && this.state.areaInput.find(
      (d) =>
        locationX >= d.startX &&
        locationX <= d.endX &&
        locationY >= d.startY &&
        locationY <= d.endY
    );

    if (area && inputs.every((d) => d !== area.id)) {
      this.setState({ userInputs: userInputs.concat(area.id) });
      setTimeout(() => {
        this.judgeWinner();
        this.AIAction();
      }, 5);
    }
  }

  AIAction() {
    const { userInputs, AIInputs, result } = this.state;
    if (result !== -1) {
      return;
    }
    while (true) {
      const inputs = userInputs.concat(AIInputs);
      const randomNumber = Math.round(Math.random() * 8.3);
      if (inputs.every((d) => d !== randomNumber)) {
        this.setState({ AIInputs: AIInputs.concat(randomNumber) });
        this.judgeWinner();
        break;
      }
    }
  }

fetchApi(){
 const config = {
      headers: { 'Access-Control-Allow-Origin': '*' },
    };
    axios
      .get(AWS_CENTER_POINTS_URL, config)
      .then((res) => {
        const centrePointsVal = res.data.sort((a, b) => a.y- b.y);
        if(centrePointsVal.length!=0){
           this.setState({ centrePointsVal});
        }
      });
      axios
      .get(AWS_AREA_URL)
      .then((res) => {
        if(res.data.length!=0){
          const arraySort=  res.data.sort((a, b) => a.id - b.id);
           this.setState({ areaInput: arraySort});
        }
      });
}
  
  
  componentDidMount() {
      this.fetchApi();    
  }

  
  isWinner(inputs: number[]) {
    return CONDITIONS.some((d) =>
      d.every((item) => inputs.indexOf(item) !== -1)
    );
  }
  judgeWinner() {
    const { userInputs, AIInputs, result } = this.state;
    const inputs = userInputs.concat(AIInputs);

    if (inputs.length >= 5) {
      let res = this.isWinner(userInputs);
      if (res && result !== GAME_RESULT_USER) {
        return this.setState({ result: GAME_RESULT_USER });
      }
      res = this.isWinner(AIInputs);
      if (res && result !== GAME_RESULT_AI) {
        return this.setState({ result: GAME_RESULT_AI });
      }
    }

    if (
      inputs.length === 9 &&
      result === GAME_RESULT_NO &&
      result !== GAME_RESULT_TIE
    ) {
      this.setState({ result: GAME_RESULT_TIE });
    }
  }

  render() {
    const { userInputs, AIInputs, result } = this.state;
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={(e) => this.boardClickHandler(e)}>
          <View style={styles.board}>
            <View style={styles.line} />
            <View
              style={[
                styles.line,
                {
                  width: 3,
                  height: 306,
                  transform: [{ translateX: 200 }],
                },
              ]}
            />
            <View
              style={[
                styles.line,
                {
                  width: 306,
                  height: 3,
                  transform: [{ translateY: 100 }],
                },
              ]}
            />
            <View
              style={[
                styles.line,
                {
                  width: 306,
                  height: 3,
                  transform: [{ translateY: 200 }],
                },
              ]}
            />
            {this.state.centrePointsVal.length!=0 && userInputs.map((d, i) => (
              <Circle
                key={i}
                xTranslate={this.state.centrePointsVal[d].x}
                yTranslate={this.state.centrePointsVal[d].y}
                color="deepskyblue"
              />
            ))}
            {this.state.centrePointsVal.length!=0 && AIInputs.map((d, i) => (
              <Cross
                key={i}
                xTranslate={this.state.centrePointsVal[d].x}
                yTranslate={this.state.centrePointsVal[d].y}
              />
            ))}

          </View>
        </TouchableWithoutFeedback>
        <PromptArea result={result} onRestart={() => this.restart()} />
      </View>
    );
  }
}
