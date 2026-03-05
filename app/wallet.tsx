import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '../constants/theme';
import { userProfile } from '../constants/mockData';

export default function WalletScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Dompet</Text>
          <Text style={styles.subtitle}>Kelola saldo kamu</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <View style={styles.balanceLabelRow}>
              <Text style={styles.balanceLabel}>Saldo</Text>
              <Image
                source={require('../resources/icons/icon-full.png')}
                style={styles.balanceLogo}
                resizeMode="contain"
              />
              <Text style={styles.balanceLabel}>Pay</Text>
            </View>
            <Ionicons name="eye-outline" size={18} color={Colors.textSecondary} />
          </View>
          <Text style={styles.balanceAmount}>{userProfile.walletBalance}</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.balanceBtn} activeOpacity={0.7}>
              <View style={styles.balanceBtnIcon}>
                <Ionicons name="add" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.balanceBtnText}>Top Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceBtn} activeOpacity={0.7}>
              <View style={styles.balanceBtnIcon}>
                <Ionicons name="send" size={16} color={Colors.primary} />
              </View>
              <Text style={styles.balanceBtnText}>Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceBtn} activeOpacity={0.7}>
              <View style={styles.balanceBtnIcon}>
                <Ionicons name="qr-code-outline" size={16} color={Colors.primary} />
              </View>
              <Text style={styles.balanceBtnText}>Bayar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
          {[
            { icon: 'wallet', name: 'Pay', detail: 'Utama', color: Colors.primary },
            { icon: 'card', name: 'BCA Debit', detail: '****4821', color: Colors.accentBlue },
            { icon: 'qr-code-outline', name: 'QRIS', detail: 'Scan & Pay', color: '#6C63FF' },
            { icon: 'cash', name: 'Tunai', detail: 'Bayar langsung', color: Colors.accent },
          ].map((method, i) => (
            <TouchableOpacity key={i} style={styles.methodCard} activeOpacity={0.7}>
              <View style={[styles.methodIcon, { backgroundColor: method.color + '12' }]}>
                <Ionicons name={method.icon as any} size={20} color={method.color} />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>{method.name}</Text>
                <Text style={styles.methodDetail}>{method.detail}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transaksi Terakhir</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          {[
            { title: 'Ride ke AEON Mall', amount: '- Rp30.000', time: 'Hari ini, 14:30', type: 'debit' },
            { title: 'Top Up via BCA', amount: '+ Rp100.000', time: 'Hari ini, 10:00', type: 'credit' },
            { title: 'Ride ke Stasiun', amount: '- Rp18.000', time: 'Kemarin, 09:15', type: 'debit' },
            { title: 'Cashback Promo', amount: '+ Rp5.000', time: 'Kemarin, 09:16', type: 'credit' },
            { title: 'Ride ke Rumah', amount: '- Rp25.000', time: '28 Feb, 20:00', type: 'debit' },
          ].map((tx, i) => (
            <View key={i} style={styles.txRow}>
              <View style={[
                styles.txIcon,
                tx.type === 'credit' ? styles.txIconCredit : styles.txIconDebit,
              ]}>
                <Ionicons
                  name={tx.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                  size={16}
                  color={tx.type === 'credit' ? Colors.primary : Colors.error}
                />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txTime}>{tx.time}</Text>
              </View>
              <Text style={[
                styles.txAmount,
                tx.type === 'credit' ? styles.txAmountCredit : styles.txAmountDebit,
              ]}>
                {tx.amount}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  // Balance Card
  balanceCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    ...Shadows.md,
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  balanceLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  balanceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  balanceLogo: {
    width: 54,
    height: 14,
  },
  balanceAmount: {
    fontSize: FontSize.hero,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  balanceBtn: {
    alignItems: 'center',
  },
  balanceBtnIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  balanceBtnText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  // Section
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  // Methods
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  methodDetail: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  // Transactions
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceDivider,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  txIconCredit: {
    backgroundColor: Colors.primaryLight,
  },
  txIconDebit: {
    backgroundColor: '#FFEBEE',
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  txTime: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  txAmount: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  txAmountCredit: {
    color: Colors.primary,
  },
  txAmountDebit: {
    color: Colors.textSecondary,
  },
});
