import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated
} from "react-native";

const products = [
  {
    id: "1",
    name: "Áo Hoodie",
    price: "350.000đ",
    image: "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-ljza65f1i77mcb",
    description:
      "Áo hoodie thời trang trẻ trung, giữ ấm tốt, phong cách streetwear."
  },
  {
    id: "2",
    name: "Áo thun",
    price: "200.000đ",
    image:
      "https://bizweb.dktcdn.net/100/497/316/products/beauty-mau-do1.jpg?v=1703739830703",
    description:
      "Áo thun cotton 100% thoáng mát, phù hợp mặc hàng ngày."
  },
  {
    id: "3",
    name: "Quần jean",
    price: "400.000đ",
    image:
      "https://bizweb.dktcdn.net/100/393/147/products/img-1474.jpg?v=1655458984080",
    description:
      "Quần jean co giãn, form slim fit hiện đại."
  },
    {
    id: "4",
    name: "Áo sơ mi",
    price: "400.000đ",
    image:
      "https://product.hstatic.net/200000588671/product/ao-so-mi-nam-bycotton-trang-art-nhan_8ec622a241ea4deb93a02bdbdcb87954_master.jpg",
    description:
      "Áo sơ mi tay dài, phù hợp cho công sở. Chất liệu thoáng mát, thấm hút mồ hôi."
  },
    {
    id: "5",
    name: "váy dài",
    price: "400.000đ",
    image:
      "https://pos.nvncdn.com/b153ea-53436/ps/20240722_2zx5cOzrat.jpeg?v=1721624447",
    description:
      "Váy dài mùa hè, chất liệu thoáng mát."
  },
    {
    id: "6",
    name: "Giày-Nike",
    price: "400.000đ",
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/413/756/products/nike-air-jordan-1-low-gs-553560-7-1731904620405.jpg?v=1731904624617",
    description:
      "Giày nike với thiết kế đẹp mắt, hiện đại, đảm bảo thoải mái cho các hoạt động vui chơi."
  },
    {
    id: "7",
    name: "Áo ba lỗ",
    price: "400.000đ",
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/290/346/products/ao-thun-ba-lo-ao-tanktop-trang-ac21-bia-2.png",
    description:
      "Siêu thấm hút mồ hôi, thoải mái phù hợp cho các bạn nam tập gym."
  },
    {
    id: "8",
    name: "Quần legging",
    price: "400.000đ",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDHvImSVgtAqcxSUWC9NOxvp5kwIy-tkZ1iw&s",
    description:
      "Thoải mái vận động, thấm hút mồ hôi."
  },
];

const HomeScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    }).start();
  }, []);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((item) => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const renderItem = ({ item }) => {
    const scale = new Animated.Value(1);

    const pressIn = () => {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true
      }).start();
    };

    const pressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true
      }).start();
    };

    return (
      <Animated.View
        style={{
          transform: [{ scale }],
          opacity: fadeAnim,
          flex: 1
        }}
      >
        <TouchableOpacity
          style={styles.card}
          onPressIn={pressIn}
          onPressOut={pressOut}
          onPress={() => navigation.navigate("Detail", { product: item })}
        >
          <Image source={{ uri: item.image }} style={styles.image} />

          <TouchableOpacity
            style={styles.heart}
            onPress={() => toggleFavorite(item.id)}
          >
            <Text style={{ fontSize: 20 }}>
              {favorites.includes(item.id) ? "❤️" : "🤍"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛍 Shop Quần Áo</Text>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 10
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10
  },

  card: {
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 15,
    padding: 10,
    elevation: 6
  },

  image: {
    width: "100%",
    height: 140,
    borderRadius: 10
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5
  },

  price: {
    color: "#ff3d71",
    marginTop: 3,
    fontWeight: "600"
  },

  heart: {
    position: "absolute",
    top: 10,
    right: 10
  }
});