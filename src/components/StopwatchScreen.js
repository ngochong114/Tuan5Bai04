import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { formatStopwatch } from '../utils/timeFormatter'

const StopwatchScreen = () => {
    const [elapsed, setElapsed] = useState(0)
    const [isRunning, setIsRunning] = useState(false)

    useEffect(() => {
        let interval = null
        if (isRunning) {
            interval = setInterval(() => setElapsed(prev => prev + 10), 10)
        }
        return () => clearInterval(interval)
    }, [isRunning])

    const toggle = () => setIsRunning(!isRunning)
    const reset = () => {
        setIsRunning(false);
        setElapsed(0)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đồng hồ bấm giờ</Text>
            <Text style={styles.timer}>{formatStopwatch(elapsed)}</Text>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                style={[styles.btn, isRunning ? styles.stopBtn : styles.startBtn]}
                onPress={toggle}>
                    <Text style={styles.btnText}>{isRunning ? 'Dừng' : 'Bắt đầu'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={styles.resetBtn}
                onPress={reset}>
                    <Text style={styles.btnText}>Đặt lại</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f0f',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f5dd4b',
        marginBottom: 30
    },
    timer: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#f5dd4b',
        fontFamily: 'monospace',
        marginBottom: 50
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '90%'
    },
    btn: {
        paddingVertical: 15,
        paddingHorizontal: 35,
        borderRadius: 12
    },
    startBtn: {
        backgroundColor: '#4caf50'
    },
    stopBtn: {
        backgroundColor: '#f44336'
    },
    resetBtn: {
        backgroundColor: '#333',
        paddingVertical: 15,
        paddingHorizontal: 35,
        borderRadius: 12
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    }
})

export default StopwatchScreen