import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Octicons from '@expo/vector-icons/Octicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function EditScreen() {
    const { id } = useLocalSearchParams();
    const [todos, setTodos] = useState({});
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const router = useRouter();

    const [loaded, error] = useFonts({
        Inter_500Medium,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('TodoApp');
                const storageTodos = jsonValue ? JSON.parse(jsonValue) : [];

                if (storageTodos.length) {
                    const myTodo = storageTodos.find(todo => todo.id.toString() === id);
                    if (myTodo) {
                        setTodos(myTodo);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, [id]);

    if (!loaded && !error) {
        return null;
    }

    const styles = createStyles(theme, colorScheme);

    const handleSave = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('TodoApp');
            const storageTodos = jsonValue ? JSON.parse(jsonValue) : [];

            const index = storageTodos.findIndex(todo => todo.id === todos.id);
            if (index !== -1) {
                storageTodos[index] = todos;
            } else {
                storageTodos.push(todos);
            }

            await AsyncStorage.setItem('TodoApp', JSON.stringify(storageTodos));
            router.push('/');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    maxLength={30}
                    placeholder="Edit todo"
                    placeholderTextColor="gray"
                    value={todos?.title || ''}
                    onChangeText={(text) => setTodos(prev => ({ ...prev, title: text }))}
                />
                <Pressable
                    onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
                    style={{ marginLeft: 10 }}>
                    {colorScheme === 'dark'
                        ? <Octicons name="moon" size={36} color={theme.text} selectable={undefined} style={{ width: 36 }} />
                        : <Octicons name="sun" size={36} color={theme.text} selectable={undefined} style={{ width: 36 }} />}
                </Pressable>
            </View>
            <View style={styles.inputContainer}>
                <Pressable onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push('/')}
                    style={[styles.saveButton, { backgroundColor: 'red' }]}>
                    <Text style={[styles.saveButtonText, { color: 'white' }]}>Cancel</Text>
                </Pressable>
            </View>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaView>
    );
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            width: '100%',
        },
        inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            width: "100%",
            maxWidth: 1024,
            marginHorizontal: "auto",
        },
        input: {
            flex: 1,
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 5,
            marginRight: 10,
            padding: 10,
            fontSize: 18,
            color: theme.text,
        },
        saveButton: {
            backgroundColor: theme.button,
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
        },
        saveButtonText: {
            color: colorScheme === 'dark' ? "black" : "white",
            fontSize: 18,
        },
    });
}
