import { EffectComposer, Bloom } from '@react-three/postprocessing'

function Effects(props) {

    return (
        <EffectComposer>
            <Bloom 
                mipmapBlur
                intensity={props.intensity}
            /> 
        </EffectComposer>
    )

}

export default Effects;