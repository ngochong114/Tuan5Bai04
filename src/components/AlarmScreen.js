import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AlarmItem from './AlarmItem';

const AlarmScreen = () => {
  const [alarms, setAlarms] = React.useState([]);
  const [isPickerVisible, setPickerVisible] = React.useState(false);

  React.useEffect(() => {
    const loadAlarms = async () => {
      try {
        const saved = await AsyncStorage.getItem('alarms');
        if (saved) {
          const parsed = JSON.parse(saved);
          setAlarms(Array.isArray(parsed) ? parsed.filter(a => a && typeof a.hour === 'number') : []);
        }
      } catch (e) {
        console.log('Load alarms error:', e);
        setAlarms([]);
      }
    };
    loadAlarms();
  }, []);

  React.useEffect(() => {
    AsyncStorage.setItem('alarms', JSON.stringify(alarms));
  }, [alarms]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      alarms.forEach((alarm) => {
        if (
          alarm?.enabled &&
          alarm.hour === now.getHours() &&
          alarm.minute === now.getMinutes() &&
          now.getSeconds() === 0
        ) {
          Alert.alert(
            '⏰ BÁO THỨC!',
            `Đã đến giờ: ${alarm.hour.toString().padStart(2, '0')}:${alarm.minute
              .toString()
              .padStart(2, '0')}`
          );
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms]);

  const handleAddAlarm = (date) => {
    const newAlarm = {
      id: Date.now().toString(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      enabled: true,
    };
    setAlarms((prev) => [...prev, newAlarm]);
    setPickerVisible(false);
  };

  const toggleAlarm = (id) => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  const deleteAlarm = (id) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Báo thức</Text>

      <TouchableOpacity style={styles.addBtn} onPress={() => setPickerVisible(true)}>
        <Text style={styles.addText}>+ Thêm báo thức mới</Text>
      </TouchableOpacity>

      {alarms.length === 0 ? (
        <Text style={styles.empty}>Chưa có báo thức nào</Text>
      ) : (
        <FlatList
          data={alarms}
          keyExtractor={(item) => item?.id || Math.random().toString()}
          renderItem={({ item }) => {
            if (!item || typeof item.hour !== 'number') return null;
            return (
              <AlarmItem
                alarm={item}
                onToggle={toggleAlarm}
                onDelete={deleteAlarm}
              />
            );
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="time"
        onConfirm={handleAddAlarm}
        onCancel={() => setPickerVisible(false)}
        is24Hour={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20 },
  addBtn: { backgroundColor: '#4caf50', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  addText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  empty: { color: '#666', fontSize: 18, textAlign: 'center', marginTop: 50 },
});

export default AlarmScreen;