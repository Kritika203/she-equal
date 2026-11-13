// Sample submissions for Bring an Opportunity.



export const BRING_PAY_METHODS = ['Bank transfer', 'Payoneer', 'Wise', 'Other'];

export function buildBringSeeds() {
  const date = new Date().toISOString().slice(0, 10);
  return [
    {
      id: 'seed-opp-1', type: 'opportunity', status: 'pending', date,
      name: 'Sujan Karki', organisation: 'Nepali Tech Circle — Sydney', country: 'Australia', email: 'sujan@example.com',
      title: 'Chat support for an online store (Nepali + English)', category: 'Virtual Assistant',
      description: 'An online store run by Nepali owners in Sydney needs help answering customer chats. You will answer simple questions about prices, delivery and orders.',
      deliverables: ['Answer customer chats in English and Nepali', 'Reply within the same day'],
      skillsRequired: ['English Writing', 'Customer Chat Support'],
      budgetMin: 40, budgetMax: 60, deadlineDays: 7, paymentMethod: 'Bank transfer',
      needsOwnLaptop: true, internetNeed: 'Basic', beginnerFriendly: true,
    },
    {
      id: 'seed-insight-1', type: 'insight', status: 'pending', date,
      name: 'Anita Shrestha', organisation: 'Himalaya Tourism Partners', country: 'Australia', email: 'anita@example.com',
      text: 'Hotels here are asking for short booking videos. Video editing is asked for more every month.',
    },
  ];
}
