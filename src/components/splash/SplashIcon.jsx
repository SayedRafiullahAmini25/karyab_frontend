import { Image, StyleSheet, View } from "react-native";
import splashIcon from '../../../assets/splash-icon/splashLogo.png'

export default function SplashIcon () {

    return (
        <View style={styles.container}>
            <Image source={splashIcon} style={styles.image}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        width : 200,
        height : 200,
    },
    image :{
        width : '100%',
        height : '100%',
        resizeMode : 'center'
    }
})