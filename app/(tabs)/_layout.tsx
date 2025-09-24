import { Tabs } from "expo-router";
import { ChartBar, House, User, Wallet } from "phosphor-react-native";
import { View } from "react-native";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        animation: "fade",
        headerShown: false,
        tabBarItemStyle: {
          // overflow: "hidden",
          height: 100,
        },
        tabBarStyle: {
          elevation: 0,
          marginHorizontal: 20,
          position: "absolute",
          bottom: 30,
          width: "90%",
          borderRadius: 50,
          height: 62,
          overflow: "hidden",
          boxShadow: "0px 2px 15px rgba(0, 0, 0, 0.1)",
          borderColor: "transparent",
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <House
              size={27}
              style={{ marginTop: 18 }}
              color={focused ? "#299d91" : "#9f9f9f"}
              weight="fill"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          tabBarIcon: ({ focused }) => (
            <ChartBar
              size={27}
              style={{ marginTop: 18 }}
              color={focused ? "#299d91" : "#9f9f9f"}
              weight="fill"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          tabBarIcon: ({ focused }) => (
            <Wallet
              size={27}
              style={{ marginTop: 18 }}
              color={focused ? "#299d91" : "#9f9f9f"}
              weight="fill"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <User
              size={27}
              style={{ marginTop: 18 }}
              color={focused ? "#299d91" : "#9f9f9f"}
              weight="fill"
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
