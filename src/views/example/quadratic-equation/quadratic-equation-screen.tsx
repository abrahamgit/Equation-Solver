import * as React from "react"
import { ViewStyle, TextStyle, View, Dimensions } from "react-native"
import Katex from 'react-native-katex';
import { Text } from "../../shared/text"
import { color } from "../../../theme"
import { Button } from '../../shared/button'
import { TextField } from '../../shared/text-field'
import { Header } from '../../shared/header'
import { NavigationScreenProps } from "react-navigation"
import QuadracticSolve from '../../../lib/quadratic'

export interface QuadraticEquationScreenProps extends NavigationScreenProps<{}> {
}

const { width, height } = Dimensions.get('window')
const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1
}
const TextStyle: TextStyle = {
  fontSize: 20
}
const HeaderStyle: ViewStyle = {
  backgroundColor: color.primaryDarker,
}
const EquationView: ViewStyle = {
  width: width,
  height: height / 8,
}

const textStyle: TextStyle = {
  marginTop: 15, 
  fontSize: 20,
  color: 'white'
}
const InputView: ViewStyle = {
  flexDirection: 'row',
  margin: 20
}

const inputStyle: TextStyle = {
  textAlign: 'center', 
  color: 'black'
}

const Input: ViewStyle = {
  width: width / 4,
  height: 15,
  marginLeft: 20
}

const ButtonView: ViewStyle = {
  flexDirection: 'row', 
  margin: 20, 
  justifyContent: 'space-between'
}


const inlineStyle =`
html, body {
  display: flex;
  background-color: #1d1d1d;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin-top: 9px;
}
.katex {
  font-size: 5em;
  margin: 0;
  display: flex;
  color: white;
}
`;

interface State {
  a: string,
  b: string,
  c: string,
  loaded: boolean,
  roots: string[]
}

export class QuadraticEquation extends React.Component<QuadraticEquationScreenProps, State> {

  state = {
    a: null,
    b: null,
    c: null,
    loaded: false,
    roots: null
  }
  solve = async () => {
    const { a, b , c  } = this.state
    if(isNaN(a) || isNaN(b) || isNaN(c) ){
       return;
    }


    const roots = await QuadracticSolve(Number(a),Number(b),Number(c))
    this.setState({ roots })

  }
  render () {
    const { goBack } = this.props.navigation
    const { roots } = this.state

    return (
      <View style={ROOT}>
        <Header  
          headerTx="quadratic.header" 
          style={HeaderStyle} 
          titleStyle={TextStyle}
          leftIcon="chevron-left"
          onLeftPress={() => goBack()}
           />
          <View style={EquationView}> 
           <Katex
              expression="ax^2 + bx + c = 0"
              style={{flex: 1}}
              inlineStyle={inlineStyle}
              displayMode={false}
              colorIsTextColor={false}
              onLoad={() => this.setState({ loaded: true })}
              onError={() => console.error('Error')}
            />
           </View>
           <View style={InputView}>
                <Text style={textStyle}> a  = </Text>
                <TextField 
                  style={Input} 
                  inputStyle={inputStyle}
                  keyboardType={'numeric'}
                  onChangeText={(a) => this.setState({ a })}
                />
           </View>
           <View style={InputView}>
                <Text style={textStyle}> b  = </Text>
                <TextField 
                  style={Input} 
                  inputStyle={inputStyle}
                  keyboardType={'numeric'}
                  onChangeText={b => this.setState({ b })}
                />
           </View>
           <View style={InputView}>
                <Text style={textStyle}> c  = </Text>
                <TextField 
                  style={Input} 
                  inputStyle={inputStyle}
                  keyboardType={'numeric'}
                  onChangeText={c => this.setState({ c })}
                />
           </View>
           <View style={ButtonView}>
              <Button preset="solve" text="Solve" onPress={this.solve} />
              <Button preset="solve" text="Clear" />
           </View>
           <View style={{ justifyContent: 'center', alignItems: 'center'}}>
            {
              roots && roots.map((item, index) => {
                const ind = index + 1
                  return <Text key={index} style={textStyle}>{"x" + ind  + " = " + item}</Text>
              })
            }
            </View>
      </View>
    )
  }
}
