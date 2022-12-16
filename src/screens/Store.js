import { Image, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import productAction from "../redux/actions/productAction";
import SelectDropdown from "react-native-select-dropdown";
import { Searchbar, Button, Card, Title, Paragraph } from "react-native-paper";

const Filter = [
  "Selec Filter",
  "Desk",
  "Tables",
  "Vases",
  "Frames",
  "Cushions",
  "Diffuser",
  "Mirrors",
  "Blanckets",
];

export default function Store(props) {
  const [first, setfirst] = useState("");
  const { getProducts, getProductsFilter } = productAction;
  const { products, name } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    if (name) {
      dispatch(getProductsFilter(name));
    } else {
      dispatch(getProducts());
    }

    // eslint-disable-next-line
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Image
        style={styles.img}
        source={require("../../assets/Store.png")}
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

      <View style={styles.select}>
        <SelectDropdown
          data={Filter}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item;
          }}
        />
      </View>
      <View style={{ padding: 15 }}>
        {products.map((item) => {
          return (
            <Card style={{ marginBottom: 20 }}>
              <Card.Content>
                <Card.Cover source={{ uri: item.photo[0] }} />
                <Title>{item.name}</Title>
                <Paragraph>Category: {item.category}</Paragraph>
                <Paragraph>Price: {item.price}</Paragraph>
              </Card.Content>
              <Card.Actions style={{ justifyContent: "space-around" }}>
                <Button
                  style={{ backgroundColor: "gray" }}
                  mode="contained"
                  onPress={() => {
                    props.navigation.navigate("Detail", {
                      idProduct: item._id,
                    });
                  }}
                >
                  More info
                </Button>
                <Button>❤</Button>
                <Button>Add to cart</Button>
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
});