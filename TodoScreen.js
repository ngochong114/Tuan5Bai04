import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const TodoScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');

  const addTask = () => {
    if (taskText.trim() === '') return;
    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
      scaleValue: new Animated.Value(1),
    };
    setTasks([newTask, ...tasks]);
    setTaskText('');
  };

  const toggleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );

    // Animation scale nhẹ khi check/uncheck
    const task = tasks.find((t) => t.id === id);
    if (task) {
      Animated.sequence([
        Animated.timing(task.scaleValue, {
          toValue: 0.92,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(task.scaleValue, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }) => (
    <Animated.View
      style={[
        styles.taskCard,
        {
          transform: [{ scale: item.scaleValue }],
          opacity: item.completed ? 0.78 : 1,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => toggleComplete(item.id)}
      >
        <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
          {item.completed && (
            <Icon 
              name="check-bold" 
              size={24} 
              color="#ffffff" 
            />
          )}
        </View>
      </TouchableOpacity>

      <Text
        style={[
          styles.taskText,
          item.completed && styles.taskCompleted,
        ]}
      >
        {item.text}
      </Text>

      <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
        <Icon name="trash-can-outline" size={24} color="#ff4757" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#6b48ff']}
      style={styles.gradientBg}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>✨ Công Việc Của Tôi ✨</Text>
          <Text style={styles.subtitle}>
            Còn {tasks.filter(t => !t.completed).length} việc cần làm • Đã hoàn thành {tasks.filter(t => t.completed).length}
          </Text>
        </View>

        {/* Danh sách công việc */}
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="playlist-check" size={90} color="rgba(255,255,255,0.45)" />
              <Text style={styles.emptyText}>Chưa có công việc nào...</Text>
              <Text style={styles.emptySub}>Thêm nhiệm vụ mới nhé! 🚀</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />

        {/* Input + nút thêm */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Thêm việc cần làm..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={taskText}
            onChangeText={setTaskText}
            onSubmitEditing={addTask}
          />
          <TouchableOpacity style={styles.fab} onPress={addTask}>
            <Icon name="plus" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  checkboxContainer: {
    marginRight: 14,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#4caf50', // xanh lá tươi, đẹp hơn
    borderColor: '#4caf50',
  },
  taskText: {
    flex: 1,
    fontSize: 17,
    color: '#fff',
    fontWeight: '500',
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: 'rgba(255,255,255,0.65)',
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff4757',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    elevation: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 20,
    fontWeight: '600',
  },
  emptySub: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 8,
  },
});

export default TodoScreen;