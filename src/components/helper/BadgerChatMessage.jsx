import { Text, StyleSheet, TouchableOpacity } from "react-native";
import BadgerCard from "./BadgerCard";

function BadgerChatMessage(props) {
    const dt = new Date(props.created);
    const { id, isOwnedByUser, onDelete } = props;

    return <BadgerCard style={styles.card}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.details}>by {props.poster} | Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</Text>
        <Text style={styles.content}>{props.content}</Text>
        {isOwnedByUser && (
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        )}
    </BadgerCard>
}

const styles = StyleSheet.create({
    card: {
        marginTop: 16,
        padding: 8,
        marginLeft: 8,
        marginRight: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '600', 
    },
    details: {
        fontSize: 12,
        color: 'gray' 
    },
    content: {
        fontSize: 16, 
        marginTop: 4 
    },
    deleteButton: {
        marginTop: 12,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center', 
        justifyContent: 'center'
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16
    }
});

export default BadgerChatMessage;
