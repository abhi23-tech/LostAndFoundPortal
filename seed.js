const Item = require('./models/Item');
const d = n => new Date(Date.now() - n * 864e5);
module.exports = async function seed() {
  if (await Item.countDocuments()) return;
  await Item.insertMany([
    { title: 'Black HP laptop charger', type: 'found', category: 'Electronics', location: 'Library, 2nd floor', date: d(1), contactName: 'Front Desk', contact: 'library@college.edu', description: '65W charger with a green sticker on the cable.' },
    { title: 'Blue water bottle', type: 'lost', category: 'Other', location: 'Canteen', date: d(2), contactName: 'Aarav Mehta', contact: '98220 11111', description: 'Steel bottle with a dent near the base.' },
    { title: 'Student ID card (CSE-3rd yr)', type: 'found', category: 'ID & Cards', location: 'Block B corridor', date: d(2), contactName: 'Security Office', contact: 'Ext. 204' },
    { title: 'Data Structures notebook', type: 'lost', category: 'Books & Notes', location: 'Lecture Hall 4', date: d(3), contactName: 'Sneha Kulkarni', contact: 'sneha.k@college.edu', description: 'Red cover, name written inside.' },
    { title: 'Bike key with panda keychain', type: 'found', category: 'Keys', location: 'Parking lot A', date: d(4), contactName: 'Rohan Patil', contact: '98900 22222', status: 'pending',
      claims: [{ name: 'Isha Nair', contact: 'isha.n@college.edu', message: 'It has a Honda tag and a small scratch on the panda.' }] },
    { title: 'Grey hoodie', type: 'lost', category: 'Clothing', location: 'Sports ground', date: d(5), contactName: 'Kabir Shah', contact: '97650 33333' },
    { title: 'Casio scientific calculator', type: 'found', category: 'Electronics', location: 'Exam hall 2', date: d(6), contactName: 'Exam Cell', contact: 'Ext. 118', status: 'returned' },
    { title: 'Black backpack', type: 'lost', category: 'Bags', location: 'Bus stop near main gate', date: d(1), contactName: 'Meera Joshi', contact: 'meera.j@college.edu', description: 'Contains a lab coat and a blue pouch.' }
  ]);
  console.log('Seeded demo data');
};
