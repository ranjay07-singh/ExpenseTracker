import { ActivityIndicator, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import FinanceTips from '../../components/FinanceTips';
import { useFinanceTips } from '../../hooks/useFinanceTips';

const TipsScreen = () => {
  const { tipsData, loading, state } = useFinanceTips();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!tipsData || !state) {
    return (
      <Animated.View
        entering={FadeInDown.springify().damping(14)}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}
      >
        <Text>Location information or finance tips are currently unavailable.</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(14)}
      style={{ flex: 1 }}
    >
      <FinanceTips state={state} tipsData={tipsData} />
    </Animated.View>
  );
};

export default TipsScreen;