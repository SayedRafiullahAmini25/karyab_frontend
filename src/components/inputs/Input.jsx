import { StyleSheet, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export default function Input({ placeHolder, icon, setValue, value, isSecret, type, keyboardType }) {
  return (
    <View style={styles.container}>
      <MaterialIcons name={icon} color={COLORS.primaryDark} size={20} style={styles.icon} />
      <TextInput
        placeholder={placeHolder}
        placeholderTextColor="#9AA59F"
        textAlign="right"
        style={styles.input}
        onChangeText={setValue}
        value={value}
        secureTextEntry={isSecret}
        textContentType={type}
        selectionColor={COLORS.primary}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#DDE7E1',
    borderRadius: 14,
    backgroundColor: '#FAFCFB',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: { position: 'absolute', left: 15 },
  input: {
    flex: 1,
    fontFamily: 'yakan',
    fontSize: 13,
    color: COLORS.text,
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
});
