import { Text, View, TextInput,Pressable,StyleSheet,FlatList } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useState } from "react";
import { data } from "@/data/todos";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
export default function Index() {
  const [todos, setTodos] = useState(data.sort((a,b)=>b.id - a.id));
  const [text, setText] = useState("");

  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0? todos[0].id +1:1;
      setTodos([{id:newId,title:text,complete:false},...todos]);
      setText("");
    }
  }
  const toggleTodo = (id)=>{
    setTodos(todos.map(todo=> todo.id === id ? {...todo,completed:!todo.completed} : todo));
  }
  const removeTodo = (id)=>{
    setTodos(todos.filter(todo=>todo.id !== id))
  }
  const renderItem = ({ item })=>(
    <View style={styles.todoItem}>
      <Text
        style={[styles.todoText,item.completed && styles.completedText]}
        onPress={()=>toggleTodo(item.id)}
      >
        {item.title}
      </Text>
      <Pressable onPress={()=>removeTodo(item.id)}>
      <MaterialCommunityIcons name="delete-circle" size={36} color="red" />
      </Pressable>
    </View>
  )
  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todo=>todo.id}
        contentContainerStyle={{flexGrow:1}}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding:10,
    width:"100%",
    maxWidth:1024,
    marginHorizontal:"auto",
    pointerEvents:"auto",
  },
  input: {
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    padding:10,
    fontSize:18,
    minWidth:0,
    color:"white",
  },
  addButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "black",
    fontSize: 18,
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomColor:'gray',
    borderBottomWidth:1,
    gap:4,
    width:"100%",
    maxWidth:1024,
    marginHorizontal:"auto",
    pointerEvents:"auto",
  },
  todoText:{
    flex:1,
    fontSize:18,
    color:"white",
  },
  completedText:{
    textDecorationLine:"line-through",
    color:"gray",
  }
});