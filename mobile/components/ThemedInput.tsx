import { StyleSheet, TextInput, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { useColorScheme } from "react-native";

type Props = {
    label: string;
    onChangeText: (text: string) => void;
}

const ThemedInput = ({ label, onChangeText }: Props) => {
    const themedColor = useColorScheme();
    const color = themedColor === 'light' ? 'black' : 'white';

    return (
        <View>
            <ThemedText>{label}</ThemedText>
            <TextInput style={{ ...styles.input, borderColor: color, color: color }} onChangeText={onChangeText} />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        width: 250,
        height: 35,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10
    }
});

export default ThemedInput;
