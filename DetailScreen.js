import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const DetailScreen = ({ route, navigation }) => {
  const { product } = route.params;

  const [quantity, setQuantity] = useState(1);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const addToCart = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();

    Alert.alert("🎉 Thành công", "Đã thêm sản phẩm vào giỏ hàng");
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.infoBox}>
        <Text style={styles.name}>{product.name}</Text>

        <Text style={styles.price}>{product.price}</Text>

        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.quantityBox}>
          <TouchableOpacity
            onPress={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            <Text style={styles.qtyBtn}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qty}>{quantity}</Text>

          <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
            <Text style={styles.qtyBtn}>+</Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <LinearGradient
            colors={["#ff7e5f", "#feb47b"]}
            style={styles.button}
          >
            <TouchableOpacity onPress={addToCart}>
              <Text style={styles.buttonText}>Thêm vào giỏ</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Quay lại Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },

  image: {
    width: "100%",
    height: 320
  },

  infoBox: {
    padding: 20
  },

  name: {
    fontSize: 26,
    fontWeight: "bold"
  },

  price: {
    fontSize: 22,
    color: "#ff3d71",
    marginVertical: 10
  },

  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20
  },

  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },

  qtyBtn: {
    fontSize: 26,
    paddingHorizontal: 15
  },

  qty: {
    fontSize: 18
  },

  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },

  backButton: {
    alignItems: "center"
  },

  backText: {
    fontSize: 16,
    color: "#007bff"
  }
});