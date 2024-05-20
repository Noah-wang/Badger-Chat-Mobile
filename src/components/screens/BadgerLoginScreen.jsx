import { useState } from "react";
import { Alert, Button, StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";

function BadgerLoginScreen(props) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');


    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
        <Text>Username: </Text>
        <TextInput
            style={styles.userInput}
            onChangeText={setUserName} value={userName} placeholder='Username' />
        <Text>Password: </Text>
        <TextInput
            style={styles.userInput}
            onChangeText={setPassword} value={password} placeholder='Password' secureTextEntry={true} />
        <View style={styles.buttonContainer}>
            <Button color="red" title="Login" onPress={() => {
                if (userName.length === 0) {
                    Alert.alert("Please input a valid username");
                } else if (password.length === 0) {
                    Alert.alert("please input a valid password");
                } else {
                    props.handleLogin(userName, password)
                }

            }} />
            <Button color="grey" title="GO to Sign Up" onPress={() => props.setIsRegistering(true)} />
            <Button color="blue" title="Continue As Guest" onPress={() => props.handleGuest()} />
        </View>
    </View >;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'left',
        justifyContent: 'center',
        padding: 20,
    },
    userInput: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
        borderRadius: 5
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
});

export default BadgerLoginScreen;