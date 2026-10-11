import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { SplashScreen } from '../screens/SplashScreen';
import { LoadingQuoteScreen } from '../screens/LoadingQuoteScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SignUpInfoScreen } from '../screens/SignUpInfoScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { ForgotPasswordVerifyScreen } from '../screens/ForgotPasswordVerifyScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';
import { CreatePasswordScreen } from '../screens/CreatePasswordScreen';
import { VerifyEmailScreen } from '../screens/VerifyEmailScreen';
import { SignUpAssessmentScreen } from '../screens/SignUpAssessmentScreen';
import { PricingScreen } from '../screens/PricingScreen';
import { PaystackCheckoutScreen } from '../screens/PaystackCheckoutScreen';
import { TransactionReceiptScreen } from '../screens/TransactionReceiptScreen';
import { SubjectSelectionScreen } from '../screens/SubjectSelectionScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { LessonReaderScreen } from '../screens/LessonReaderScreen';
import { AllSubjectsScreen } from '../screens/AllSubjectsScreen';
import { PersonalInformationScreen } from '../screens/PersonalInformationScreen';
import { ProfileDetailsScreen } from '../screens/ProfileDetailsScreen';
import { AccountSettingsScreen } from '../screens/AccountSettingsScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { DeactivateAccountScreen } from '../screens/DeactivateAccountScreen';
import { SubscriptionScreen } from '../screens/SubscriptionScreen';
import { FavoriteSavedScreen } from '../screens/FavoriteSavedScreen';
import { PromoReferralsScreen } from '../screens/PromoReferralsScreen';
import { LeadershipBoardScreen } from '../screens/LeadershipBoardScreen';
import { AvatarPickerScreen } from '../screens/AvatarPickerScreen';
import { HelpSupportScreen } from '../screens/HelpSupportScreen';
import { LiveChatScreen } from '../screens/LiveChatScreen';
import { LegalScreen } from '../screens/LegalScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';
import { TermsConditionsScreen } from '../screens/TermsConditionsScreen';
import { AboutUsScreen } from '../screens/AboutUsScreen';
import { NotificationScreen } from '../screens/NotificationScreen';
import { LearningTodosScreen } from '../screens/LearningTodosScreen';
import { LearningTodoDetailScreen } from '../screens/LearningTodoDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoadingQuote" component={LoadingQuoteScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpInfo" component={SignUpInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPasswordVerify" component={ForgotPasswordVerifyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpAssessment" component={SignUpAssessmentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Pricing" component={PricingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PaystackCheckout" component={PaystackCheckoutScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TransactionReceipt" component={TransactionReceiptScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="SubjectSelection" component={SubjectSelectionScreen} options={{ title: 'Select Subject' }} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz' }} />
        <Stack.Screen name="LessonReader" component={LessonReaderScreen} options={{ title: '' }} />
        <Stack.Screen name="AllSubjects" component={AllSubjectsScreen} options={{ title: 'Subjects' }} />
        <Stack.Screen name="PersonalInformation" component={PersonalInformationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DeactivateAccount" component={DeactivateAccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FavoriteSaved" component={FavoriteSavedScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PromoReferrals" component={PromoReferralsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LeadershipBoard" component={LeadershipBoardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AvatarPicker" component={AvatarPickerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LiveChat" component={LiveChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Legal" component={LegalScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AboutUs" component={AboutUsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LearningTodos" component={LearningTodosScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LearningTodoDetail" component={LearningTodoDetailScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
