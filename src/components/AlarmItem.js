import React from 'react'
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native'

const AlarmItem = ({ alarm, onToggle, onDelete }) => {
    return (
        <View style={styles.item}>
            <Text style={styles.time}>{alarm.hour.toString().padStart(2, '0')}:{alarm.minute.toString().padStart(2, '0')}</Text>

            <Switch
                value={alarm.enabled}
                onValueChange={() => onToggle(alarm.id)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={alarm.enabled ? '#f5dd4b' : '#f4f3f4'}
            />

            <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(alarm.id)}>
                <Text style={styles.deleteText}>Xoá</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        padding: 15,
        borderRadius: 10,
        marginVertical: 8
    },
    time: {
        flex: 1,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff'
    },
    deleteBtn: {
        backgroundColor: '#f44336',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8
    },
    deleteText: {
        color: '#fff',
        fontWeight: 'bold'
    }
})

export default AlarmItem