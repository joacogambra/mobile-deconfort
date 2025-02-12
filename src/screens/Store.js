import { Alert, Image, ScrollView, StyleSheet, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import productAction from "../redux/actions/productAction";
import { Searchbar, Button, Card, Title, Paragraph } from "react-native-paper";
import usersAction from "../redux/actions/usersActions";
import axios from "axios";
import apiUrl from "../../url";
import Favorite from "../components/Favorite";
import { Ionicons } from '@expo/vector-icons';
import cartActions from "../redux/actions/cartActions";


export default function Store(props) {
  const [open2, setOpen2] = useState(false);
  const { idUser, user, token } = useSelector((state) => state.user);
  const { getProducts, getProductsFilter, getOneProduct } = productAction;
  const { getUser } = usersAction;
  const [first, setfirst] = useState("");
  const { products, name } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const { getCartProduct } = cartActions;

  useEffect(() => {
    dispatch(getUser(idUser));
    // eslint-disable-next-line
  }, []);

  const handleOpen2 = () => {
    open2 ? setOpen2(false) : setOpen2(true);
  };

  useEffect(() => {
    if (name) {
      dispatch(getProductsFilter(name));
    } else {
      dispatch(getProducts());
    }

    // eslint-disable-next-line
  }, []);

  async function getCartProducts() {
    try {
      let res = await dispatch(getCartProduct(idUser));
      console.log(res.payload);
    } catch (error) {
      console.log(error);
    }
  }

  async function pushoneProduct(idProduct) {
    try {
      await dispatch(getOneProduct(idProduct));
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <ScrollView style={styles.container}>
      <Image
        style={styles.img}
        source={require("../../assets/StoreSirve.png")}
      ></Image>
      <View style={{ padding: 15 }}>
        <Searchbar
          style={{ marginTop: 10 }}
          placeholder="Search"
          onChangeText={(e) => {
            setfirst(e);
            let text = e;
            dispatch(getProductsFilter({ name: text }));
          }}
        />
      </View>

      <View style={{ padding: 15 }}>
        <Button
          style={{ backgroundColor: "#5c195d" }}
          mode="contained"
          onPress={handleOpen2}
        >
          Categories ⇓
        </Button>
        {open2 ? (
          <>
            <Text
              style={{
                textAlign: "center",
                height: 30,
                fontSize: 15,
                marginTop: 10,
              }}
              onPress={() => {
                props.navigation.navigate("Desk");
              }}
            >
              Desk
            </Text>
            <Text
              style={{ textAlign: "center", height: 30, fontSize: 15 }}
              onPress={() => {
                props.navigation.navigate("Tables");
              }}
            >
              Tables
            </Text>
            <Text
              style={{ textAlign: "center", height: 30, fontSize: 15 }}
              onPress={() => {
                props.navigation.navigate("Vases");
              }}
            >
              Vases
            </Text>
            <Text
              style={{ textAlign: "center", height: 30, fontSize: 15 }}
              onPress={() => {
                props.navigation.navigate("Frames");
              }}
            >
              Frames
            </Text>
            <Text
              style={{ textAlign: "center", height: 30, fontSize: 15 }}
              onPress={() => {
                props.navigation.navigate("Cushions");
              }}
            >
              Cushions
            </Text>
            <Text
              style={{ textAlign: "center", height: 30, fontSize: 15 }}
              onPress={() => {
                props.navigation.navigate("Diffuser");
              }}
            >
              Diffuser
            </Text>
            <Text
              style={{ textAlign: "center", height: 30, fontSize: 15 }}
              onPress={() => {
                props.navigation.navigate("Mirrors");
              }}
            >
              Mirrors
            </Text>
            <Text
              style={{ textAlign: "center", height: 30, fontSize: 15 }}
              onPress={() => {
                props.navigation.navigate("Blankets");
              }}
            >
              Blankets
            </Text>
          </>
        ) : null}
      </View>
      <View style={styles.select}></View>
      <View style={{ padding: 15 }}>
        {products.map((item) => {
          async function addToCart() {
            let product = {
              name: item.name,
              photo: item.photo[0],
              price: item.price,
              productId: item._id,
              userId: idUser,
            };
            try {
              let res = await axios.post(`${apiUrl}api/shopping`, product);
              if (user && res.data.success) {
                getCartProducts();
                Alert.alert(user.name, `${res.data.message} 🛒`, [
                  {
                    text: "OK",
                  },
                ]);
              }
            } catch (error) {
              console.log(error);
              if (user && error) {
                Alert.alert(
                  user.name,
                  "The product is already in the cart 🛒",
                  [
                    {
                      text: "OK",
                    },
                  ]
                );
              }
            }
          }

          return (
            <Card style={styles.styleGeneralCard} key={item._id}>
              <Card.Content>
                <Card.Cover
                  style={styles.image_card}
                  source={{ uri: item.photo[0] }}
                />
                <View style={styles.reactionContainer}>
                  <Favorite productId={item._id} />
                </View>

                <Title>{item.name}</Title>
                <Paragraph>Category: {item.category}</Paragraph>
                <Paragraph>Price: {item.price}</Paragraph>
              </Card.Content>

              <Card.Actions>
                <Button
                  buttonColor="#5c195d"
                  textColor="white"
                  onPress={() => {
                    pushoneProduct(item._id);
                    props.navigation.navigate("Detail", {
                      idProduct: item._id,
                    });
                  }}
                >
                  More info{" "}
                  <Ionicons
                    name="information-circle-outline"
                    size={21}
                    color="white"
                  />
                </Button>
                <Button
                  buttonColor="#5c195d"
                  textColor="white"
                  onPress={() => {
                    if (token) {
                      if (item.stock > 0) {
                        addToCart();
                      } else {
                        Alert.alert(
                          "Ups!",
                          "At the moment we do not have stock of this product"
                        );
                      }
                    } else {
                      Alert.alert(
                        "Ups!",
                        "You have to registered to add this product to your cart"
                      );
                    }
                  }}
                >
                  Add to cart{" "}
                  <Ionicons name="cart-outline" size={24} color="white" />
                </Button>
              </Card.Actions>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    backgroundColor: "white",
  },
  img: {
    marginTop: 30,
    width: "100%",
    height: 150,
    resizeMode: "stretch",
    backgroundColor: "white",
  },
  select: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  reactionContainer: {
    position: "absolute",
    top: 20,
    left: 40,
    width: 70,
  },
  //De aca para abajo es para el estilo de la card
  styleGeneralCard: {
    margin: 10,
    minHeight: 150,
  },

  image_card: {
    // position: "relative",
    top: -16,
    // left:109,
    width: "70%",
    left: 105,
    height: 260,
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 30,
  },
});
