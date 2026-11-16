// zion - hardcoded demo data for the money demo
export const demoAccounts = [
  { id: 'checking', name: 'Everyday Checking', last4: '4821', balance: 320000 },
  { id: 'savings', name: 'Emergency Savings', last4: '9036', balance: 500000 },
  { id: 'spending', name: 'Spending Account', last4: '1174', balance: 18000 }
];
export const demoExpenses = [
  { id: 'rent', name: 'Rent', category: 'Housing', due: 'Nov 18', amount: 140000 },
  { id: 'power', name: 'Electric bill', category: 'Utilities', due: 'Nov 20', amount: 12500 },
  { id: 'internet', name: 'Internet', category: 'Utilities', due: 'Nov 21', amount: 6500 },
  { id: 'phone', name: 'Phone plan', category: 'Utilities', due: 'Nov 23', amount: 5500 },
  { id: 'insurance', name: 'Car insurance', category: 'Transport', due: 'Nov 25', amount: 16000 },
  { id: 'card', name: 'Credit card statement', category: 'Debt payment', due: 'Nov 27', amount: 32000 }
];
export const demoBudget = { income: 420000, everyday: 75000, savings: 60000 };
export const totalBills = demoExpenses.reduce((sum, bill) => sum + bill.amount, 0);
export function normalizePayments(value) {
  const result = {};
  if (!value || typeof value !== 'object') return result;
  for (const bill of demoExpenses) {
    if (demoAccounts.some(account => account.id === value[bill.id])) result[bill.id] = value[bill.id];
  }
  return result;
}
export function moneySnapshot(payments = {}) {
  const paid = normalizePayments(payments);
  return {
    accounts: demoAccounts.map(account => ({ ...account, balance: account.balance - demoExpenses.reduce((sum, bill) => sum + (paid[bill.id] === account.id ? bill.amount : 0), 0) })),
    unpaid: demoExpenses.filter(bill => !paid[bill.id]),
    paid
  };
}
export function payAllExpenses(payments, accountId) {
  const snapshot = moneySnapshot(payments);
  const account = snapshot.accounts.find(item => item.id === accountId);
  if (!account) return { error: 'Choose a funding account.' };
  if (!snapshot.unpaid.length) return { error: 'All expenses are already paid.' };
  const total = snapshot.unpaid.reduce((sum, bill) => sum + bill.amount, 0);
  if (account.balance < total) return { error: 'This account has insufficient funds. Choose another account.' };
  return { payments: { ...snapshot.paid, ...Object.fromEntries(snapshot.unpaid.map(bill => [bill.id, accountId])) }, total, count: snapshot.unpaid.length };
}
