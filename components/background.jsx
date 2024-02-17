import React from "react";
import {Dimensions } from 'react-native';
import { Canvas, Circle, Group, Vertices, vec, Shadow, Blur} from "@shopify/react-native-skia";
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


const Background = () => {
    const vertices = [vec(width/1.5, height/2), vec(width + 300,height), vec(-300, height)];
    const vertices1 = [vec(width/1.25, height * .25), vec(width + 300,height), vec(-100, height)];
    const colors= ["#6aafdf", "#6aafdf", "#6aafdf"]
    const colors1= ["#2a3641", "#2a3641", "#2a3641"]

  return (
    <Canvas style={{ width, height, backgroundColor: 'rgba(0, 0, 0, 0)' }}>
      <Group>
          <Vertices vertices={vertices1} colors={colors1}/>
          <Shadow dx={2} dy={2} blur={10} color="#93b8c4" outter />
          <Vertices vertices={vertices} colors={colors}/>
          <Shadow dx={2} dy={2} blur={10} color="#2a3641" outter />
      </Group>
    </Canvas>
  );
};
 
export default Background;