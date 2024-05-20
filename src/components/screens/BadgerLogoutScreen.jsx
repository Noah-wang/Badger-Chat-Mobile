import { Alert, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as SecureStore from 'expo-secure-store';

function BadgerLogoutScreen(props) {
    const handleLogout = () => {
        SecureStore.deleteItemAsync('jwt').then(() => {
            props.onLogout();
        })
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Are you sure you're done?</Text>
            <Text style={styles.subtitle}>Come back soon!</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 30,
        color: '#666',
    },
    logoutButton: {
        paddingHorizontal: 30,
        paddingVertical: 12,
        backgroundColor: '#FF6347',
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    }
});

export default BadgerLogoutScreen;
