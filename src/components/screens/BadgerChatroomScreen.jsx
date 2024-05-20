import { Alert, StyleSheet, Text, View, FlatList, RefreshControl, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import BadgerChatMessage from '../helper/BadgerChatMessage';

function BadgerChatroomScreen(props) {
    const [chatMessages, setChatMessages] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showPostModal, setShowPostModal] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [currentUsername, setCurrentUsername] = useState(null);
    const { chatroomName } = props;

    async function fetchToken() {
        return await SecureStore.getItemAsync('jwt');
    }

    const loadMessages  = useCallback(async () => {
        setIsRefreshing(true);
        const token = await fetchToken();
        fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-CS571-ID': `bid_e5c17fa842e9e34246e0da9d18c22b2ea6fe5d66d8ed25f597bd150ed148f8b6`
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            return response.json();
        }).then(data => {
            setChatMessages(data.messages);
            setIsRefreshing(false);
        })
    }, [chatroomName]);

    const loadCurrentUser = () => {
        fetchToken().then(token => {
            fetch('https://cs571.org/api/s24/hw9/whoami', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CS571-ID': `bid_e5c17fa842e9e34246e0da9d18c22b2ea6fe5d66d8ed25f597bd150ed148f8b6`
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch current user');
                }
                return response.json();
            }).then(data => {
                if (data && data.user && data.user.username) {
                    setCurrentUsername(data.user.username);
                } else {
                    console.log('No username found in the response.');
                    setCurrentUsername(null);
                }
            })
        }).catch(error => {
            console.error('Error fetching token:', error);
        });

    };

    useEffect(() => {
        loadMessages();
    }, [chatroomName]);

    useEffect(() => {
        if (!props.isGuest) {
            loadCurrentUser();
        }
    }, []);

    const createPost = () => {
        fetchToken()
            .then(token => {
                fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'X-CS571-ID': `bid_e5c17fa842e9e34246e0da9d18c22b2ea6fe5d66d8ed25f597bd150ed148f8b6`
                    },
                    body: JSON.stringify({ title: newPostTitle, content: newPostContent }),
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to create post');
                    }
                    return response.json();
                }).then(() => {
                    Alert.alert("Success", "Your post was successfully created!");
                    setNewPostTitle('');
                    setNewPostContent('');
                    setShowPostModal(false);
                    loadMessages(1);
                })
            });
    };

    const deletePost = (postId) => {
        Alert.alert("Delete Post", "Are you sure you want to delete this post?", [{ text: "Cancel", style: "cancel" }, {
            text: "OK",
            onPress: () => {
                fetchToken().then(token => {
                    fetch(`https://cs571.org/api/s24/hw9/messages?id=${postId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'X-CS571-ID': `bid_e5c17fa842e9e34246e0da9d18c22b2ea6fe5d66d8ed25f597bd150ed148f8b6`
                        }
                    }).then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to delete post');
                        }
                        return response.json();
                    }).then(() => {
                        Alert.alert("Success", "Successfully deleted the post!");
                        loadMessages(1);
                    })
                }
                );
            }
        }], { cancelable: false });
    };
    return (
        <View style={styles.container}>
            <FlatList
                data={chatMessages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <BadgerChatMessage
                        {...item}
                        isOwnedByUser={item.poster === currentUsername}
                        onDelete={() => deletePost(item.id)}

                    />
                )}
                refreshControl={
                    <RefreshControl
                        isRefreshing={isRefreshing}
                        onRefresh={loadMessages}
                    />
                }
                ListEmptyComponent={<Text style={styles.emptyMessage}>There's nothing here!</Text>}
            />
            <TouchableOpacity
                style={[currentUsername !== null ? styles.addPostButton : styles.cantAddPostButton]}
                onPress={() => setShowPostModal(true)}
                disabled={currentUsername === null}
            >
                <Text style={styles.buttonText}>Add Post</Text>
            </TouchableOpacity>

            <Modal animationType="fade" transparent={true} visible={showPostModal} change={() => setShowPostModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Create A Post</Text>
                        <TextInput
                            placeholder="Title"
                            style={styles.modalInput}
                            value={newPostTitle}
                            onChangeText={setNewPostTitle}
                        />
                        <TextInput
                            placeholder="Content"
                            multiline
                            style={[styles.modalInput, styles.modalBodyInput]}
                            value={newPostContent}
                            onChangeText={setNewPostContent}
                        />
                        <View>
                            <Button
                                title="Cancel"
                                onPress={() => setShowPostModal(false)}
                            />
                            <Text></Text>
                            <Button
                                title="Create Post"
                                onPress={createPost}
                                disabled={!newPostTitle.trim() || !newPostContent.trim()}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    emptyMessage: {
        fontSize: 18,
        color: 'grey',
        textAlign: 'center',
        marginTop: 20,
    },
    addPostButton: {
        padding: 15,
        backgroundColor: 'green',
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    cantAddPostButton: {
        padding: 15,
        backgroundColor: 'grey',
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInput: {
        fontSize: 18,
        borderColor: 'grey',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        width: '100%',
        borderRadius: 5,
    },
    modalBodyInput: {
        height: 100,
        textAlignVertical: 'top',
        fontSize: 18,
        borderColor: 'grey',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: 10,
    }
});

export default BadgerChatroomScreen;
