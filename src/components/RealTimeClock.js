import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { formatDigitalTime, formatDateVN } from '../utils/timeFormatter'

const RealTimeClock = () => {
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đồng hồ</Text>
            <Text style={styles.clock}>{formatDigitalTime(currentTime)}</Text>
            <Text style={styles.date}>{formatDateVN(currentTime)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f0f0f'
    },
    title: {
        fontSize: 30,
        color: '#aaa',
        marginBottom: 10
    },
    clock: {
        fontSize: 80,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'monospace'
    },
    date: {
        fontSize: 18, color: '#aaa', marginTop: 10
    }
})

export default RealTimeClock