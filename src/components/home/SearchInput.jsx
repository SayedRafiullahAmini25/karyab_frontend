import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors";

export default function SearchInput () {

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="جستجو برای کارگر یا شغل ..."/>
            </View>
            <TouchableOpacity style={styles.searchBadge}>
                <Ionicons name="search-outline" size={22} color='#ffff' />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flexDirection : 'row',
        width : '100%',
        justifyContent : 'space-evenly',
        marginVertical : 30
    },
    inputContainer : {
        width : '86%',
        backgroundColor : '#c3d4e788',
        borderTopLeftRadius : 8,
        borderBottomLeftRadius : 8
    },
    input : {
        textAlign : 'right',
        fontSize : 16,
        fontFamily : 'yakan',
        paddingHorizontal : 8
    },
    searchBadge : {
        width : '14%',
        justifyContent  :'center',
        alignItems : 'center',
        backgroundColor : COLORS.primaryDark,
        borderTopRightRadius : 8,
        borderBottomRightRadius : 8
    }
})