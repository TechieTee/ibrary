import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

// Built from Figma frames 661:16346/16347/16348 — a simulated Paystack
// checkout (method select -> card form / mobile money form). Per the
// user: "no light and dark because this is gonna be a third party
// integration" — so, deliberately, this screen does NOT call useTheme()
// and does not follow this app's color tokens. It always renders with
// Paystack's own literal light checkout colors, regardless of the app's
// theme, since a real Paystack WebView would look the same either way.
//
// This is a simulation only — no real card/mobile-money processing, no
// Paystack SDK. "Pay"/"Confirm" just mark the plan as purchased and
// return to Pricing to show its success modal. The GHS-currency/amount
// literally shown in Figma's mock (a stock Paystack screenshot) is
// replaced with the actual Naira amount selected on the Pricing screen.

type Props = NativeStackScreenProps<RootStackParamList, 'PaystackCheckout'>;

type Method = 'select' | 'card' | 'momo';

const COLORS = {
  bg: '#FFFFFF',
  headerBg: '#F4F4F4',
  text: '#4C4C4C',
  muted: '#9E9E9E',
  border: '#E4E4E4',
  fieldBg: '#F5F5F5',
  green: '#4FB472',
  greenBg: 'rgba(79,180,114,0.6)',
  dark: '#2E3C4E',
};

export function PaystackCheckoutScreen({ route, navigation }: Props) {
  const { amount, cycle, mode } = route.params;
  const [method, setMethod] = useState<Method>('select');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [phone, setPhone] = useState('');
  const [provider, setProvider] = useState('');

  function completePayment() {
    navigation.replace('Pricing', { justSubscribed: true, cycle, mode });
  }

  function CancelBar() {
    return (
      <Pressable
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Cancel payment"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          alignSelf: 'center',
          marginTop: 32,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: COLORS.border,
          backgroundColor: COLORS.fieldBg,
        }}
      >
        <Ionicons name="close" size={15} color={COLORS.dark} />
        <Text style={{ color: COLORS.dark, fontSize: 15 }}>Cancel Payment</Text>
      </Pressable>
    );
  }

  function SecuredFooter() {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 24 }}>
        <Ionicons name="lock-closed" size={13} color={COLORS.muted} />
        <Text style={{ textAlign: 'center', color: COLORS.muted, fontSize: 13 }}>
          Secured by <Text style={{ fontWeight: '700', color: '#011B33' }}>paystack</Text>
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ backgroundColor: COLORS.headerBg, paddingTop: 16, paddingBottom: 20, paddingHorizontal: 24 }}>
        <Text style={{ color: '#00B45E', fontWeight: '700', fontSize: 13, letterSpacing: 0.4 }}>PAYSTACK CHECKOUT</Text>
        <Text style={{ color: COLORS.muted, fontSize: 14, marginTop: 8 }}>
          Use one of the payment methods below to pay{'\n'}
          ₦{amount.toLocaleString()} to iBrary
        </Text>
      </View>

      <View style={{ flex: 1, padding: 24 }}>
        {method === 'select' && (
          <View style={{ gap: 4 }}>
            <Pressable
              onPress={() => setMethod('momo')}
              accessibilityRole="button"
              accessibilityLabel="Pay with Mobile Money"
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border }}
            >
              <Ionicons name="phone-portrait-outline" size={18} color={COLORS.text} />
              <Text style={{ color: COLORS.text, fontSize: 16 }}>Pay with Mobile Money</Text>
            </Pressable>
            <Pressable
              onPress={() => setMethod('card')}
              accessibilityRole="button"
              accessibilityLabel="Pay with Card"
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border }}
            >
              <Ionicons name="card-outline" size={18} color={COLORS.text} />
              <Text style={{ color: COLORS.text, fontSize: 16 }}>Pay with Card</Text>
            </Pressable>
            <CancelBar />
            <SecuredFooter />
          </View>
        )}

        {method === 'card' && (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="card-outline" size={18} color={COLORS.text} />
              <Text style={{ color: COLORS.text, fontSize: 16 }}>Pay with Card</Text>
            </View>
            <Text style={{ textAlign: 'center', color: '#535353', fontSize: 17, marginTop: 24, marginBottom: 24 }}>
              Enter your card details to pay
            </Text>
            <View style={{ gap: 16 }}>
              <CheckoutField label="CARD NUMBER" placeholder="0000 0000 0000 0000" value={cardNumber} onChangeText={setCardNumber} keyboardType="number-pad" />
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <View style={{ flex: 1 }}>
                  <CheckoutField label="CARD EXPIRY" placeholder="MM/YY" value={cardExpiry} onChangeText={setCardExpiry} />
                </View>
                <View style={{ flex: 1 }}>
                  <CheckoutField label="CVV" placeholder="123" value={cardCvv} onChangeText={setCardCvv} keyboardType="number-pad" />
                </View>
              </View>
            </View>

            <Pressable
              onPress={completePayment}
              accessibilityRole="button"
              accessibilityLabel={`Pay ₦${amount.toLocaleString()}`}
              style={{ backgroundColor: COLORS.greenBg, borderRadius: 4, height: 62, alignItems: 'center', justifyContent: 'center', marginTop: 24 }}
            >
              <Text style={{ color: COLORS.bg, fontSize: 18, fontWeight: '600' }}>Pay ₦{amount.toLocaleString()}</Text>
            </Pressable>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 32 }}>
              <Pressable onPress={() => setMethod('select')} accessibilityRole="button" accessibilityLabel="Change payment method" style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8, borderRadius: 4, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.fieldBg }}>
                <Ionicons name="close" size={14} color={COLORS.dark} />
                <Text style={{ color: COLORS.dark, fontSize: 14 }}>Change Payment Method</Text>
              </Pressable>
              <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Cancel payment" style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8, borderRadius: 4, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.fieldBg }}>
                <Ionicons name="close" size={14} color={COLORS.dark} />
                <Text style={{ color: COLORS.dark, fontSize: 14 }}>Cancel Payment</Text>
              </Pressable>
            </View>
            <SecuredFooter />
          </View>
        )}

        {method === 'momo' && (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="phone-portrait-outline" size={18} color={COLORS.text} />
              <Text style={{ color: COLORS.text, fontSize: 16 }}>Pay with Mobile Money</Text>
            </View>
            <Text style={{ textAlign: 'center', color: '#535353', fontSize: 17, marginTop: 24, marginBottom: 24 }}>
              Enter your mobile money number and provider to start the payment
            </Text>
            <View style={{ gap: 16 }}>
              <CheckoutField label="PHONE NUMBER" placeholder="024 123 4567" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              <CheckoutField label="PROVIDER" placeholder="Choose Provider" value={provider} onChangeText={setProvider} />
            </View>

            <Pressable
              onPress={completePayment}
              accessibilityRole="button"
              accessibilityLabel="Confirm"
              style={{ backgroundColor: COLORS.greenBg, borderRadius: 4, height: 62, alignItems: 'center', justifyContent: 'center', marginTop: 24 }}
            >
              <Text style={{ color: COLORS.bg, fontSize: 18, fontWeight: '600' }}>Confirm</Text>
            </Pressable>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 32 }}>
              <Pressable onPress={() => setMethod('select')} accessibilityRole="button" accessibilityLabel="Change payment method" style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8, borderRadius: 4, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.fieldBg }}>
                <Ionicons name="close" size={14} color={COLORS.dark} />
                <Text style={{ color: COLORS.dark, fontSize: 14 }}>Change Payment Method</Text>
              </Pressable>
              <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Cancel payment" style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8, borderRadius: 4, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.fieldBg }}>
                <Ionicons name="close" size={14} color={COLORS.dark} />
                <Text style={{ color: COLORS.dark, fontSize: 14 }}>Cancel Payment</Text>
              </Pressable>
            </View>
            <SecuredFooter />
          </View>
        )}
      </View>
    </View>
  );
}

function CheckoutField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'number-pad' | 'phone-pad';
}) {
  return (
    <View style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, paddingHorizontal: 12, paddingTop: 6, paddingBottom: 8 }}>
      <Text style={{ color: '#A7A7A7', fontSize: 10, letterSpacing: 0.3 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.muted}
        keyboardType={keyboardType}
        accessibilityLabel={label}
        style={{ color: '#9E9E9E', fontSize: 16, paddingVertical: 2 }}
      />
    </View>
  );
}
