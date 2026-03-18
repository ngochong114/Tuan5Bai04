import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { formatCountdown } from '../utils/timeFormatter';

const CountdownScreen = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);

  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  useEffect(() => {
    if (!isRunning) setRemaining(totalSeconds);
  }, [hours, minutes, seconds, isRunning]);

  useEffect(() => {
    let interval = null;
    if (isRunning && remaining > 0) {
      interval = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            Alert.alert('⏰ HẾT THỜI GIAN!', 'Đếm ngược đã hoàn tất!', [{ text: 'OK' }]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, remaining]);

  const toggleTimer = () => {
    if (remaining === 0 && !isRunning) return;
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemaining(totalSeconds);
  };

  const applyPreset = (presetMinutes) => {
    setIsRunning(false);
    const h = Math.floor(presetMinutes / 60);
    const m = presetMinutes % 60;
    setHours(h);
    setMinutes(m);
    setSeconds(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đếm Ngược</Text>

      {/* Timer Display */}
      <View style={[styles.timerContainer, isRunning && styles.timerRunning]}>
        <Text style={styles.timer}>{formatCountdown(remaining)}</Text>
      </View>

      {/* Preset Buttons */}
      {!isRunning && (
        <View style={styles.presetContainer}>
          <Text style={styles.presetTitle}>Chọn nhanh</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetScroll}>
            {[5, 10, 15, 25, 30, 45, 60, 90].map((min) => (
              <TouchableOpacity
                key={min}
                style={styles.presetButton}
                onPress={() => applyPreset(min)}
              >
                <Text style={styles.presetText}>{min} phút</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Picker */}
      {!isRunning && (
        <View style={styles.pickerWrapper}>
          <View style={styles.pickerRow}>
            <View style={styles.pickerGroup}>
              <Text style={styles.label}>Giờ</Text>
              <Picker selectedValue={hours} style={styles.picker} onValueChange={setHours}>
                {Array.from({ length: 100 }, (_, i) => (
                  <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerGroup}>
              <Text style={styles.label}>Phút</Text>
              <Picker selectedValue={minutes} style={styles.picker} onValueChange={setMinutes}>
                {Array.from({ length: 60 }, (_, i) => (
                  <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerGroup}>
              <Text style={styles.label}>Giây</Text>
              <Picker selectedValue={seconds} style={styles.picker} onValueChange={setSeconds}>
                {Array.from({ length: 60 }, (_, i) => (
                  <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      )}

      {/* Control Buttons */}
      <View style={styles.controlContainer}>
        <TouchableOpacity style={styles.bigButton} onPress={toggleTimer}>
          <Text style={styles.bigButtonText}>{isRunning ? '⏸️ Dừng' : '▶️ Bắt đầu'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
          <Text style={styles.resetText}>🔄 Đặt lại</Text>
        </TouchableOpacity>
      </View>

      {isRunning && <Text style={styles.status}>Đang chạy • Không thể chỉnh sửa</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f5dd4b',
    marginBottom: 20,
  },
  timerContainer: {
    backgroundColor: '#1c1c1e',
    paddingHorizontal: 40,
    paddingVertical: 25,
    borderRadius: 20,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#333',
    shadowColor: '#f5dd4b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  timerRunning: {
    borderColor: '#4caf50',
    shadowColor: '#4caf50',
  },
  timer: {
    fontSize: 78,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'monospace',
    letterSpacing: 4,
  },
  presetContainer: {
    width: '100%',
    marginBottom: 25,
  },
  presetTitle: {
    color: '#888',
    fontSize: 16,
    marginLeft: 20,
    marginBottom: 10,
  },
  presetScroll: {
    paddingHorizontal: 15,
  },
  presetButton: {
    backgroundColor: '#1f1f1f',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  presetText: {
    color: '#f5dd4b',
    fontSize: 15,
    fontWeight: '600',
  },
  pickerWrapper: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 15,
    marginBottom: 30,
    width: '90%',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pickerGroup: {
    alignItems: 'center',
  },
  label: {
    color: '#aaa',
    fontSize: 15,
    marginBottom: 6,
    fontWeight: '500',
  },
  picker: {
    width: 95,
    height: 140,
    color: '#fff',
    backgroundColor: '#1c1c1e',
  },
  controlContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  bigButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 50,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  bigButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#333',
    paddingVertical: 18,
    paddingHorizontal: 35,
    borderRadius: 50,
  },
  resetText: {
    color: '#ddd',
    fontSize: 17,
    fontWeight: '600',
  },
  status: {
    marginTop: 25,
    color: '#4caf50',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default CountdownScreen;