import { useState } from "react";
import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";

function BadgerRegisterScreen(props) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>

        <Text>Username: </Text>
        <TextInput
            style={styles.userInput}
            onChangeText={setUserName} value={userName} placeholder='Username'
            onChange={name => setUserName(name)} />

        <Text>Password: </Text>
        <TextInput
            style={styles.userInput}
            onChangeText={setPassword} value={password} placeholder='Password' secureTextEntry={true}
            onChange={password => setPassword(password)} />

        <Text>Confirm Password: </Text>
        <TextInput
            style={styles.userInput}
            onChangeText={setConfirmPassword} value={confirmPassword} placeholder='Confirm Password' secureTextEntry={true}
            onChange={confirmPassword => setConfirmPassword(confirmPassword)} />
        <View style={styles.buttonContainer}>
            <Button color="crimson" title="Signup" onPress={() => {
                if (userName.length === 0) {
                    Alert.alert("Please input a valid username");
                } else if (password.length === 0) {
                    Alert.alert("Please input a valid password");
                } else if (confirmPassword.length === 0) {
                    Alert.alert("Please input a valid confirm password");
                } else if (password !== confirmPassword) {
                    Alert.alert("Your password and confirm password should be same");
                } else {
                    props.handleSignup(userName, password);
                }
            }} />

            <Button color="grey" title="Go Back" onPress={() =>
                props.setIsRegistering(false)} />
        </View>
    </View>;
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
    }
});

export default BadgerRegisterScreen;