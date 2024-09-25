import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState(''); 
  const [tasks, setTasks] = useState([]); 

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  
  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error(error);
    }
  };

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = () => {
    if (task.length > 0) {
      setTasks([...tasks, { key: Date.now().toString(), text: task, done: false }]);
      setTask('');
    }
  };

  const toggleTaskDone = (index) => {
    let updatedTasks = [...tasks];
    updatedTasks[index].done = !updatedTasks[index].done;
    setTasks(updatedTasks);
  };

  const renderTask = ({ item, index }) => (
    <TouchableOpacity onPress={() => toggleTaskDone(index)}>
      <Text style={[styles.task, item.done && styles.taskDone]}>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todo List</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task"
        value={task}
        onChangeText={setTask}
      />
      <Button title="Save" onPress={addTask} />
      <FlatList data={tasks} renderItem={renderTask} style={styles.taskList} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  taskList: {
    marginTop: 20,
  },
  task: {
    fontSize: 18,
    paddingVertical: 10,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});