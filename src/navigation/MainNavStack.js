import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import SingUp from "../screens/SingUp";
import Login from "../screens/Login";
import { Ionicons } from "@expo/vector-icons";
import ProfileScreen from "../screens/Profile";
import EditProfile from "../screens/EditProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usersActions from "../redux/actions/usersActions";
import { useDispatch, useSelector } from "react-redux";
import Home from "../screens/Home";
import Store from "../screens/Store";
import Forum from "../screens/Forum";
import Desk from "../screens/Desk";
// import Contact from '../screens/Contact'
import Detail from "../screens/Detail";
import Blankets from "../screens/Blankets";
import Mirrors from "../screens/Mirrors";
import Diffuser from "../screens/Diffuser";
import Cushions from "../screens/Cushions";
import Frames from "../screens/Frames";
import Vases from "../screens/Vases";
import Tables from "../screens/Tables";
import Cartprueba from "../screens/Cartprueba";
import MyFavs from "../screens/MyFavs";

const Bottom = createBottomTabNavigator();

const Navigator = () => {
  let dispatch = useDispatch();
  const [reload, setReload] = useState(true);
  const { logged, token } = useSelector((state) => state.user);
  let { reEnter, signOff } = usersActions;
  const get = async () => {
    let token = await AsyncStorage.getItem("token");
    token = token ? JSON.parse(token) : undefined;
    if (token) {
      dispatch(reEnter(token.token.user));
    }
  };
  useEffect(() => {
    get();
  }, [reload]);
  return (
    <Bottom.Navigator
      options={{ headerShown: false }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Store") {
            iconName = focused ? "grid" : "grid";
          }else if (route.name === "Forum") {
            iconName = focused ? "newspaper" : "newspaper";
          } else if (route.name === "Detail") {
            iconName = focused ? "create-sharp" : "create-sharp";
          } else if (route.name === "Login") {
            iconName = focused ? "enter" : "enter";
          } else if (route.name === "SignUp") {
            iconName = focused ? "person-add" : "person-add";
          } else if (route.name === "LogOut") {
            {
              iconName = focused ? "exit" : "exit";
              return (
                <Ionicons
                  name={iconName}
                  size={size}
                  color={color}
                  onPress={async () => {
                    try {
                      let res = await dispatch(signOff(token));
                      if (res.payload.success) {
                        await AsyncStorage.removeItem("token");
                        setReload(!reload);
                      }
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                />
              );
            }
          } else if (route.name === "Cart") {
            iconName = focused ? "md-cart-sharp" : "md-cart-sharp";
          } else if (route.name === "My Profile") {
            iconName = focused ? "person-circle-sharp" : "person-circle-sharp";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#5c195d",
        tabBarInactiveTintColor: "gray",
      })}
    >
      {!logged ? (
        <>
          <Bottom.Screen
            name="Home"
            options={{ headerShown: false }}
            component={Home}
          />

          <Bottom.Screen
            name="Store"
            options={{ headerShown: false }}
            component={Store}
          />
                    <Bottom.Screen
            name="Desk"
            options={{ tabBarItemStyle: { display: "none" } }}
            component={Desk}
          />
                              <Bottom.Screen
            name="Tables"
            options={{ tabBarItemStyle: { display: "none" } }}
            component={Tables}
          />
                              <Bottom.Screen
            name="Vases"
            options={{ tabBarItemStyle: { display: "none" } }}
            component={Vases}
          />
                              <Bottom.Screen
            name="Frames"
            options={{ tabBarItemStyle: { display: "none" } }}
            component={Frames}
          />
                              <Bottom.Screen
            name="Cushions"
            options={{ tabBarItemStyle: { display: "none" } }}
            component={Cushions}
          />
                              <Bottom.Screen
            name="Diffuser"
            options={{ tabBarItemStyle: { display: "none" } }}
            component={Diffuser}
          />
                              <Bottom.Screen
            name="Mirrors"
            options={{ tabBarItemStyle: { display: "none" } }}
            component={Mirrors}
          />
                              <Bottom.Screen
            name="Blankets"
            options={{ tabBarItemStyle: { display: "none" } }}
            component={Blankets}
          />
                    <Bottom.Screen
            name="Detail"
            options={{
              headerShown: false,
              tabBarItemStyle: { display: "none" },
            }}
            component={Detail}
          />

          <Bottom.Screen
            name="Login"
            options={{ headerShown: false }}
            component={Login}
          />

          <Bottom.Screen
            name="Forum"
            options={{ headerShown: false }}
            component={Forum}
          />

          {/* <Bottom.Screen
            name="Contact"
            options={{ headerShown: false }}
            component={Contact}
          /> */}
          <Bottom.Screen
            name="SignUp"
            options={{ headerShown: false }}
            component={SingUp}
          />
        </>
      ) : (
        <>
          <Bottom.Screen
            name="Home"
            options={{ headerShown: false }}
            component={Home}
          />
          <Bottom.Screen
            name="Cart"
            options={{ headerShown: false }}
            component={Cartprueba}
          />

          <Bottom.Screen
            name="EditProfile"
            options={{ tabBarItemStyle: { display: "none" } }}
            component={EditProfile}
          />

          <Bottom.Screen
            name="MyFavorites"
            options={{ tabBarItemStyle: { display: "none" }, headerShown: false }}
            component={MyFavs}
          />

          <Bottom.Screen
            name="Store"
            options={{ headerShown: false }}
            component={Store}
          />
          <Bottom.Screen
            name="Detail"
            options={{
              headerShown: false,
              tabBarItemStyle: { display: "none" },
            }}
            component={Detail}
          />
          <Bottom.Screen
            name="Forum"
            options={{ headerShown: false }}
            component={Forum}
          />

          <Bottom.Screen
            name="My Profile"
            options={{ headerShown: false }}
            component={ProfileScreen}
          />
          <Bottom.Screen
            name="LogOut"
            options={{ headerShown: false }}
            component={Home}
          />
        </>
      )}
    </Bottom.Navigator>
  );
};

export default Navigator;
