import { Leva } from 'leva';
import { Canvas } from '@react-three/fiber';

import './Container.scss'
import Scene from './Scene';

function Container() {

  return (
    <div className="container">

      <div className="loader">
        <div className="loader__bar"></div>
      </div>

      <Leva />
      
      <Canvas 
        flat
        camera={{ position: [.75, .7, 1.5] }}
        >

        <Scene />

      </Canvas>

    </div>
  )
}

export default Container
