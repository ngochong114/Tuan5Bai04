// App.js - Icon edit & delete nằm cùng hàng với ngày tháng + giờ
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Calendar = () => {
  const insets = useSafeAreaInsets();
  const [fabScale] = useState(new Animated.Value(1));

  const [appointments, setAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [filter, setFilter] = useState('upcoming');
  const [editingAppointment, setEditingAppointment] = useState(null);

  const animateFab = () => {
    Animated.sequence([
      Animated.timing(fabScale, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(fabScale, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(fabScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@appointments');
        if (jsonValue != null) {
          setAppointments(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error('Lỗi load', e);
      }
    };
    loadAppointments();
  }, []);

  const saveAppointments = async (newList) => {
    try {
      await AsyncStorage.setItem('@appointments', JSON.stringify(newList));
      setAppointments(newList);
    } catch (e) {
      console.error('Lỗi save', e);
    }
  };

  const openModal = (appointment = null) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setTitle(appointment.title);
      setDescription(appointment.description);
      setSelectedDate(new Date(appointment.date));
    } else {
      setEditingAppointment(null);
      setTitle('');
      setDescription('');
      setSelectedDate(new Date());
    }
    setModalVisible(true);
  };

  const saveAppointment = () => {
    if (!title.trim()) {
      alert('Nhập tiêu đề đi nha!');
      return;
    }

    const appointmentData = {
      title: title.trim(),
      description: description.trim(),
      date: selectedDate.toISOString(),
    };

    let updated;
    if (editingAppointment) {
      updated = appointments.map((item) =>
        item.id === editingAppointment.id ? { ...item, ...appointmentData } : item
      );
    } else {
      const newAppt = { id: Date.now().toString(), ...appointmentData };
      updated = [...appointments, newAppt];
    }

    updated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    saveAppointments(updated);
    setModalVisible(false);
    setEditingAppointment(null);
  };

  const deleteAppointment = (id) => {
    const updated = appointments.filter((item) => item.id !== id);
    saveAppointments(updated);
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && date) setSelectedDate(date);
  };

  const onTimeChange = (event, date) => {
    setShowTimePicker(false);
    if (event.type === 'set' && date) setSelectedDate(date);
  };

  const filteredAppointments = appointments.filter((item) => {
    const now = new Date();
    const itemDate = new Date(item.date);
    return filter === 'upcoming' ? itemDate > now : itemDate <= now;
  });

  const renderItem = ({ item }) => {
    const itemDate = new Date(item.date);
    const isPast = itemDate < new Date();
    const leftColor = isPast ? '#FF7675' : '#6C5CE7';

    return (
      <LinearGradient
        colors={['#ffffff', '#f8f9ff']}
        style={[styles.card, { borderLeftColor: leftColor }]}
      >
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>
          {item.description ? <Text style={styles.description}>{item.description}</Text> : null}

          {/* Hàng ngang: ngày + giờ + icon edit + icon delete */}
          <View style={styles.infoRow}>
            {/* Ngày + Giờ */}
            <View style={styles.dateGroup}>
              <Text style={styles.dateText}>
                {itemDate.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </Text>
              <Text style={styles.timeText}>
                {itemDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>

            {/* Icon edit & delete */}
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={() => openModal(item)} style={styles.iconWrapper}>
                <Ionicons name="pencil" size={24} color="#6C5CE7" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteAppointment(item.id)} style={styles.iconWrapper}>
                <Ionicons name="trash" size={24} color="#FF7675" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={['#6C5CE7', '#A29BFE']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Lịch Hẹn Pro</Text>
        <Text style={styles.headerSubtitle}>Lịch của tui</Text>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, filter === 'upcoming' && styles.activeTab]}
          onPress={() => setFilter('upcoming')}
        >
          <Text style={[styles.tabText, filter === 'upcoming' && styles.activeTabText]}>
            Sắp tới 🔥
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, filter === 'past' && styles.activeTab]}
          onPress={() => setFilter('past')}
        >
          <Text style={[styles.tabText, filter === 'past' && styles.activeTabText]}>
            Đã qua 🕰️
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAppointments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={90} color="#A29BFE" />
            <Text style={styles.emptyText}>Chưa có hẹn hò nào hết á!</Text>
            <Text style={styles.emptySubText}>Bấm nút + để thêm nha~ 💕</Text>
          </View>
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      />

      <Animated.View style={{ transform: [{ scale: fabScale }] }}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            animateFab();
            openModal();
          }}
        >
          <Ionicons name="add" size={36} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEditingAppointment(null);
        }}
      >
        <LinearGradient
          colors={['rgba(108,92,231,0.4)', 'rgba(162,155,254,0.4)']}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingAppointment ? '✏️ Chỉnh sửa hẹn hò' : '💖 Thêm cuộc hẹn mới'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Tiêu đề cuộc hẹn 💬"
              placeholderTextColor="#aaa"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mô tả chi tiết nha (tùy chọn) 🌸"
              placeholderTextColor="#aaa"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar" size={24} color="#6C5CE7" />
              <Text style={styles.pickerText}>
                Ngày: {selectedDate.toLocaleDateString('vi-VN')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
              <Ionicons name="time" size={24} color="#6C5CE7" />
              <Text style={styles.pickerText}>
                Giờ: {selectedDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setEditingAppointment(null);
                }}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={saveAppointment}
              >
                <Text style={[styles.buttonText, { color: 'white' }]}>Lưu luôn 💾</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7ff',
  },
  header: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  headerSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 6,
    fontStyle: 'italic',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#6C5CE7',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
    fontSize: 17,
  },
  card: {
    marginVertical: 10,
    borderRadius: 20,
    padding: 18,
    borderLeftWidth: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  description: {
    fontSize: 15,
    color: '#636e72',
    marginTop: 6,
  },
  // Hàng mới: ngày giờ + icon edit + delete
  infoRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#6C5CE7',
    fontWeight: '700',
  },
  timeText: {
    fontSize: 16,
    color: '#FF7675',
    fontWeight: '700',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 120,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6C5CE7',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 16,
    color: '#A29BFE',
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    right: 28,
    bottom: 40,
    backgroundColor: '#FF7675',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#FF7675',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    paddingBottom: 50,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6C5CE7',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#A29BFE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: '#f8f9ff',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#A29BFE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    backgroundColor: '#f8f9ff',
  },
  pickerText: {
    marginLeft: 14,
    fontSize: 16,
    color: '#2d3436',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 4,
  },
  cancelButton: {
    backgroundColor: '#dfe6e9',
  },
  saveButton: {
    backgroundColor: '#00B894',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Calendar;