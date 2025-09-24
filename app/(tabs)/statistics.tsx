import Header from "../../components/Header";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useEffect, useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import {
  fetchMonthlyData,
  fetchWeeklyData,
  fetchYearlyData,
} from "../../services/transactionServices";
import TransactionList from "../../components/TransactionList";

const Statistics = () => {
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [transaction, setTransaction] = useState([]);

  useEffect(() => {
    if (activeIndex === 0) {
      getWeeklyData();
    }
    if (activeIndex === 1) {
      getMonthlyData();
    }
    if (activeIndex === 2) {
      getYearlyData();
    }
  }, [activeIndex]);

  const getWeeklyData = async () => {
    setChartLoading(true);
    const response = await fetchWeeklyData(user?.uid as string);
    if (response.success) {
      setChartData(response.data?.stats);
      setTransaction(response.data?.transactions);
    } else {
      Alert.alert("Statistics", response.msg);
    }
    setChartLoading(false);
  };

  const getMonthlyData = async () => {
    setChartLoading(true);
    const response = await fetchMonthlyData(user?.uid as string);
    if (response.success) {
      setChartData(response.data?.stats);
      setTransaction(response.data?.transactions);
    } else {
      Alert.alert("Statistics", response.msg);
    }
    setChartLoading(false);
  };

  const getYearlyData = async () => {
    setChartLoading(true);
    const response = await fetchYearlyData(user?.uid as string);
    if (response.success) {
      setChartData(response.data?.stats);
      setTransaction(response.data?.transactions);
    } else {
      Alert.alert("Statistics", response.msg);
    }
    setChartLoading(false);
  };

  return (
    <SafeAreaView className="h-[89%]">
      <View className="px-5 gap-3">
        <Header title="Statistics" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <SegmentedControl
            appearance="light"
            style={{ height: 40 }}
            tintColor="#299d91"
            activeFontStyle={{
              fontWeight: "bold",
              color: "white",
              fontSize: 14,
            }}
            fontStyle={{ color: "black" }}
            values={["Weekly", "Monthly", "Yearly"]}
            selectedIndex={activeIndex}
            onChange={(event) =>
              setActiveIndex(event.nativeEvent.selectedSegmentIndex)
            }
          />
          <View className="relative items-center justify-center mt-5">
            {chartData.length > 0 ? (
              <BarChart
                data={chartData}
                // maxValue={10000}
                autoCenterTooltip
                showFractionalValues
                barWidth={12}
                spacing={[1, 2].includes(activeIndex) ? 25 : 15}
                yAxisLabelPrefix="$"
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisLabelWidth={[1, 2].includes(activeIndex) ? 70 : 50}
                showYAxisIndices
                noOfSections={4}
                // stepValue={10}
                roundedTop
                minHeight={1}
                isAnimated
                renderTooltip={(item: any, index: any) => {
                  return (
                    <Text
                      className={`${
                        item.spacing ? "text-primary" : "text-rose-700"
                      } text-sm`}
                    >
                      {item.value}
                    </Text>
                  );
                }}
                // yAxisTextStyle={{
                //   color: "black",
                //   fontSize: 12,
                // }}
              />
            ) : (
              <View className="" />
            )}
            {chartLoading && (
              <View className="w-full h-full absolute rounded-lg bg-[rgba(255,255,255,0.8)]">
                <Loading />
              </View>
            )}
          </View>
          {/* transaction  */}
          <View className="">
            <TransactionList
              data={transaction}
              title="Transactions"
              loading={chartLoading}
              emptyListMessage="No transactions found"
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default Statistics;
