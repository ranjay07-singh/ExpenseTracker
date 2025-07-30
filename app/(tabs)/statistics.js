import Header from '@/components/Header';
import Loading from '@/components/Loading';
import ScreenWrapper from '@/components/ScreenWrapper';
import TransactionList from '@/components/TransactionList';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { fetchMonthlyStats, fetchWeeklyStats, fetchYearlyStats } from '@/services/transactionService';
import { scale, verticalScale } from '@/utils/styling';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BarChart } from "react-native-gifted-charts";

const statistics = () => {
  const [ activeIndex, setActiveIndex ] = useState(0);
  const {user} =useAuth();
  const [chartData, setChartData]=useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(()=>{
    if(activeIndex==0){
      getWeeklystats();
    }
    if(activeIndex==1){
      getMonthlystats();
    }
    if(activeIndex==2){
      getYearlystats();
    }
  }, [activeIndex, user?.uid]); 

  const getWeeklystats = async()=>{
    if (!user?.uid) return; 
    setChartLoading(true);
    let res =await fetchWeeklyStats(user.uid);
    setChartLoading(false);
    if(res.success){
      setChartData(res?.data?.stats || []); 
      setTransactions(res?.data?.transactions || []); 
    }else{
      Alert.alert("Error", res.msg || "Failed to fetch weekly stats");
    }
  };
  const getMonthlystats = async()=>{
    if (!user?.uid) return;
    setChartLoading(true);
    let res =await fetchMonthlyStats(user.uid);
    setChartLoading(false);
    if(res.success){
      setChartData(res?.data?.stats || []);
      setTransactions(res?.data?.transactions || []);
    }else{
      Alert.alert("Error", res.msg || "Failed to fetch monthly stats");
    }
  }
  const getYearlystats = async()=>{
    if (!user?.uid) return;
    setChartLoading(true);
    // Removed 'as string' assertion
    let res =await fetchYearlyStats(user.uid);
    setChartLoading(false);
    if(res.success){
      setChartData(res?.data?.stats || []);
      setTransactions(res?.data?.transactions || []);
    }else{
      Alert.alert("Error", res.msg || "Failed to fetch yearly stats");
    }
  }
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="Statistics" />
        </View>
    <ScrollView
       contentContainerStyle={{
        gap: spacingY._20,
        paddingTop: spacingY._5,
        paddingBottom: verticalScale(100),
       }}
       showsVerticalScrollIndicator={false}
       >
        <SegmentedControl
        values={['Weekly', 'Monthly', 'Yearly']}
        selectedIndex={activeIndex}
        onChange={(event)=>{
          setActiveIndex(event.nativeEvent.selectedSegmentIndex);
        }}
        tintColor={colors.neutral200}
        backgroundColor={colors.neutral800}
        appearance='dark'
        activeFontStyle={styles.segmentFontStyle}
        style={styles.segmentStyle}
        fontStyle={{...styles.segmentFontStyle, color: colors.white}}
          />

        <View style={styles.chartContainer}>
          {
            chartData.length>0?(
              <BarChart
              data={chartData}
              barWidth={scale(10)}
              spacing={[1,2].includes(activeIndex)? scale(25): scale(16)}
              roundedTop
              roundedBottom
              hideRules
              yAxisLabelPrefix='₹' 
              yAxisThickness={0}
              xAxisThickness={0}
              yAxisLabelWidth={[1,2].includes(activeIndex)? scale(50) : scale(48)}
              yAxisTextStyle={{color: colors.neutral350}}
              xAxisLabelTextStyle={{
                color: colors.neutral350,
                fontSize: verticalScale(11),
                textAlign: 'right',
                paddingRight: scale(2),
              }}
              noOfSections={3}
              minHeight={5}
              />
            ):(
              // Render placeholder or message when no data instead of empty view
              <View style={[styles.noChart, {height: verticalScale(210)}]}>
                 {!chartLoading && <Text style={{color: colors.neutral400, textAlign: 'center'}}>No data to display</Text>}
              </View>
            )}

            {
              chartLoading && (
                <View style={ styles.chartLoadingContainer}>
                <Loading color={colors.white} />
                </View>
            )}
        </View>
        {/* transactions list */}
        <View>
        <TransactionList
          title="Transactions"
          emptyListMessage="No Transactions found!"
          data={transactions}
          />

        </View>
       </ScrollView>
       </View>
    </ScreenWrapper>
  );
};

export default statistics

const styles = StyleSheet.create({
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    overflow: 'visible', 
},
chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: 'center', 
    alignItems: 'center',     
},
header: {},
noChart: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', 
    borderRadius: radius._12, 
    borderWidth: 1, 
    borderColor: colors.neutral700, 
},
searchIcon: {
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: verticalScale(35),
    width: verticalScale(35),
    borderCurve: "continuous",
},
segmentStyle: {
    height: scale(40),
},
segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black,
},
container: {
    flex: 1, 
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
},
})