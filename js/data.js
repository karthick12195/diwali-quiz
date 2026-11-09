// =========================================================================
// 1. EMOJI CINEMA QUIZ DATASET (35 MOVIES ACROSS 4 CATEGORIES)
// =========================================================================
const CATEGORIES = {
  HOLLYWOOD: {
    id: 'HOLLYWOOD',
    name: 'Hollywood Blockbusters',
    subtitle: '10 Iconic Global Cinema Classics — Decode the 5-Emoji Plot Sequence',
    icon: '🗽',
    questions: [
      { id: 'HW-01', num: 1, emojis: '🚢 🧊 🎻 💔 🌊', answer: 'Titanic (1997)', clue: 'Jack and Rose aboard the unsinkable ocean liner.' },
      { id: 'HW-02', num: 2, emojis: '🦖 🧬 🏝️ 🚙 ⚡', answer: 'Jurassic Park (1993)', clue: 'Prehistoric DNA brought back to life on Isla Nublar.' },
      { id: 'HW-03', num: 3, emojis: '🦁 👑 🐗 🌅 🐾', answer: 'The Lion King (1994)', clue: 'Simba, Hakuna Matata, and Pride Rock.' },
      { id: 'HW-04', num: 4, emojis: '🧙‍♂️ 💍 🌋 🗡️ 👁️', answer: 'The Lord of the Rings (2001)', clue: 'One Ring to rule them all — journey to Mount Doom.' },
      { id: 'HW-05', num: 5, emojis: '🕶️ 💊 💻 ☎️ 🥷', answer: 'The Matrix (1999)', clue: 'Red pill or blue pill? Dodge bullets in the simulation.' },
      { id: 'HW-06', num: 6, emojis: '😴 🌀 🏢 🎲 ⏳', answer: 'Inception (2010)', clue: 'A dream within a dream within a dream.' },
      { id: 'HW-07', num: 7, emojis: '🚀 🌽 🕳️ ⌚ 📚', answer: 'Interstellar (2014)', clue: 'Traveling through a wormhole near Saturn to save humanity.' },
      { id: 'HW-08', num: 8, emojis: '🤡 🦇 🃏 💰 🏥', answer: 'The Dark Knight (2008)', clue: 'Why so serious? Chaos unfolds in Gotham City.' },
      { id: 'HW-09', num: 9, emojis: '🧬 🕸️ 📸 🗽 🚆', answer: 'Spider-Man (2002)', clue: 'With great power comes great responsibility.' },
      { id: 'HW-10', num: 10, emojis: '🧤 💎 🫰 ⏳ 🛡️', answer: 'Avengers: Endgame (2019)', clue: 'Time heist to undo the Infinity Gauntlet snap.' }
    ]
  },
  KOLLYWOOD: {
    id: 'KOLLYWOOD',
    name: 'Kollywood Hits (Tamil)',
    subtitle: '9 Legendary Tamil Cinema Blockbusters — Mass, Melody & Thrillers',
    icon: '🥁',
    questions: [
      { id: 'KW-01', num: 1, emojis: '🔬 🕶️ ❤️ ⚡ 🦾', answer: 'Enthiran (2010)', clue: 'Dr. Vaseegaran builds humanoid robot Chitti (Speed 1 Terahertz).' },
      { id: 'KW-02', num: 2, emojis: '🌉 🎸 🪖 🚬 🏋️‍♂️', answer: 'Vaaranam Aayiram (2008)', clue: 'Father-son bond, guitar romance, army rescue, and six-pack transformation.' },
      { id: 'KW-03', num: 3, emojis: '💇🏻‍♂️ ⚖️ 🪓 🎭 🚆', answer: 'Anniyan (2005)', clue: 'Rule-following lawyer Ambi transforms into Remo and vigilante Anniyan.' },
      { id: 'KW-04', num: 4, emojis: '🥊 👩‍👦 ✈️ 🇸🇬 🏆', answer: 'M. Kumaran S/O Mahalakshmi (2004)', clue: 'Kickboxer son travels to Malaysia/Singapore to reunite with his father.' },
      { id: 'KW-05', num: 5, emojis: '🤞 🦯 ⚔️ 🦜 🏛️', answer: 'Indian (1996)', clue: 'Veteran freedom fighter Senapathy roots out corruption using Varma Kalai.' },
      { id: 'KW-06', num: 6, emojis: '🕶️ 🪙 💰 🦁 👨‍🦲', answer: 'Sivaji: The Boss (2007)', clue: 'Flipping a one-rupee coin, turning black money into free education, Motta Boss.' },
      { id: 'KW-07', num: 7, emojis: '📸 🧠 📝 🍉 📱', answer: 'Ghajini (2005)', clue: 'Sanjay Ramasamy suffers 15-minute short-term memory loss with Polaroid tattoos.' },
      { id: 'KW-08', num: 8, emojis: '🚚 ⛓️ 🍛 🧨 🦁', answer: 'Kaithi (2019)', clue: 'One night, a lorry full of cops, biryani, and a Gatling gun.' },
      { id: 'KW-09', num: 9, emojis: '🎹 🕶️ 🐈 🩸 🐰', answer: 'Andhadhun / Blind Pianist Thriller', clue: 'A "blind" pianist witnesses a murder inside an apartment.' }
    ]
  },
  BOLLYWOOD: {
    id: 'BOLLYWOOD',
    name: 'Bollywood Classics (Hindi)',
    subtitle: '10 Iconic Hindi Blockbusters — Romance, Friendship & Triumph',
    icon: '💃',
    questions: [
      { id: 'BW-01', num: 1, emojis: '🎓 3️⃣ ✈️ 🔧 🍼', answer: '3 Idiots (2009)', clue: 'All Izz Well! Three engineering friends at Imperial College of Engineering.' },
      { id: 'BW-02', num: 2, emojis: '🚂 🌻 🪕 🕊️ 👰', answer: 'Dilwale Dulhania Le Jayenge (1995)', clue: 'Ja Simran Ja! Raj and Simran across Europe and Punjab mustard fields.' },
      { id: 'BW-03', num: 3, emojis: '🤼‍♀️ 🥇 👧 ✂️ 🇮🇳', answer: 'Dangal (2016)', clue: 'Mahavir Singh Phogat trains his daughters Geeta and Babita for Commonwealth gold.' },
      { id: 'BW-04', num: 4, emojis: '🏏 🌧️ 🌾 🇬🇧 📜', answer: 'Lagaan (2001)', clue: 'Villagers of Champaner challenge British officers to a game of cricket to waive tax.' },
      { id: 'BW-05', num: 5, emojis: '🏑 ⏱️ 🧔 👧 🏆', answer: 'Chak De! India (2007)', clue: 'Sattar Minute! Kabir Khan coaches the Indian Women’s National Hockey Team.' },
      { id: 'BW-06', num: 6, emojis: '🚗 🪂 🐂 🤿 🇪🇸', answer: 'Zindagi Na Milegi Dobara (2011)', clue: 'Three childhood friends on a bachelor road trip across Spain.' },
      { id: 'BW-07', num: 7, emojis: '🚂 🌴 🥻 ⚔️ ❤️', answer: 'Chennai Express (2013)', clue: 'Rahul boards a train to Rameshwaram and meets Meenamma.' },
      { id: 'BW-08', num: 8, emojis: '🏍️ 👬 🤠 🐎 🔥', answer: 'Sholay (1975)', clue: 'Jai, Veeru, Basanti, Thakur, and Gabbar Singh in Ramgarh.' },
      { id: 'BW-09', num: 9, emojis: '👽 📻 🛸 🙏 📿', answer: 'PK (2014)', clue: 'An alien lands on Earth, loses his remote control necklace, and questions "Wrong Number".' },
      { id: 'BW-10', num: 10, emojis: '🏀 🧣 🔔 🍬 🎻', answer: 'Kuch Kuch Hota Hai (1998)', clue: 'Rahul, Anjali, Tina — basketball, summer camp, and 8 birthday letters.' }
    ]
  },
  LUCKY: {
    id: 'LUCKY',
    name: "I'm Feeling Lucky",
    subtitle: '6 Wildcard Gems — Telugu, Malayalam & Animated Favorites',
    icon: '🎲',
    questions: [
      { id: 'LK-01', num: 1, emojis: '👑 ⚔️ 🌊 👶 🛡️', answer: 'Baahubali: The Beginning (2015)', clue: 'Shiva climbs a giant waterfall and discovers the kingdom of Mahishmati.' },
      { id: 'LK-02', num: 2, emojis: '🔥 🌊 🤝 🐅 🏹', answer: 'RRR (2022)', clue: 'Fire and Water unite — Bheem and Ram battle the British Empire.' },
      { id: 'LK-03', num: 3, emojis: '👻 💃 🏰 🗝️ 🔔', answer: 'Manichitrathazhu / Chandramukhi', clue: 'Ganga/Nagavalli unlocks the forbidden southern room in the ancestral palace.' },
      { id: 'LK-04', num: 4, emojis: '🚗 🔦 🌧️ 🚓 📺', answer: 'Drishyam (2013)', clue: 'Georgekutty constructs an airtight alibi on October 2nd and 3rd.' },
      { id: 'LK-05', num: 5, emojis: '🎈 🏠 👴 👦 🐕', answer: 'Up (2009)', clue: 'Carl Fredricksen ties thousands of balloons to his house to fly to Paradise Falls.' },
      { id: 'LK-06', num: 6, emojis: '😄 😢 😡 🤢 😱', answer: 'Inside Out (2015)', clue: 'Joy, Sadness, Anger, Disgust, and Fear inside 11-year-old Riley’s mind.' }
    ]
  }
};

// =========================================================================
// 2. NAME THE PRICE DATASET (15 BAY AREA & EVERYDAY ITEMS)
// =========================================================================
const PRICE_ITEMS = [
  { id: 'PRC-01', num: 1, title: 'Gopi Whole Yogurt Plain 64oz', store: 'Indian Cash & Carry', price: 7.49, priceDisplay: '$7.49', image: 'assets/images/01-gopi-yogurt.jpg' },
  { id: 'PRC-02', num: 2, title: 'Nanak Paneer 12Oz', store: 'Indian Cash & Carry', price: 4.99, priceDisplay: '$4.99', image: 'assets/images/02-nanak-paneer.jpg' },
  { id: 'PRC-03', num: 3, title: 'Benne Masala Dose', store: 'Mylapore Sunnyvale', price: 14.95, priceDisplay: '$14.95', image: 'assets/images/03-benne-masala-dose.jpg' },
  { id: 'PRC-04', num: 4, title: 'Matka Chai', store: 'Chandini Chowk', price: 4.99, priceDisplay: '$4.99', image: 'assets/images/04-matka-chai.jpg' },
  { id: 'PRC-05', num: 5, title: 'Caltrain from Mountain View to SF', store: 'Caltrain', price: 8.50, priceDisplay: '$8.50', image: 'assets/images/05-caltrain-mtv-sf.jpg' },
  { id: 'PRC-06', num: 6, title: 'San Mateo-Hayward Bridge Toll Solo', store: 'Bay Area FasTrak', price: 8.50, priceDisplay: '$8.50', image: 'assets/images/06-san-mateo-bridge-toll.jpg' },
  { id: 'PRC-07', num: 7, title: 'Pumpkin Spice Latte', store: 'Starbucks', price: 6.75, priceDisplay: '$6.75', image: 'assets/images/07-pumpkin-spice-latte.jpg' },
  { id: 'PRC-08', num: 8, title: 'Kirkland Signature Bath Tissue, 2-Ply, 380 Sheets, 30 Rolls', store: 'Costco', price: 24.99, priceDisplay: '$24.99', image: 'assets/images/08-kirkland-bath-tissue.jpg' },
  { id: 'PRC-09', num: 9, title: 'Tylenol Extra Strength Pain Reliever Caplets - Acetaminophen - 10ct', store: 'Target', price: 1.99, priceDisplay: '$1.99', image: 'assets/images/09-tylenol-extra-strength.jpg' },
  { id: 'PRC-10', num: 10, title: 'Cetaphil Fragrance Free Daily Face Wash Cleanser for Normal to Oily Skin - 16 fl oz', store: 'Target', price: 12.49, priceDisplay: '$12.49', image: 'assets/images/10-cetaphil-face-wash.jpg' },
  { id: 'PRC-11', num: 11, title: 'Red Onions, 5 lbs bag', store: 'Costco', price: 6.23, priceDisplay: '$6.23', image: 'assets/images/11-costco-red-onions.jpg' },
  { id: 'PRC-12', num: 12, title: 'Whole Foods Market Berry Chantilly Cake 6 Inch', store: 'Whole Foods', price: 29.99, priceDisplay: '$29.99', image: 'assets/images/12-berry-chantilly-cake.jpg' },
  { id: 'PRC-13', num: 13, title: 'Netflix Premium Subscription per month', store: 'Netflix', price: 26.00, priceDisplay: '$26.00', image: 'assets/images/13-netflix-premium.jpg' },
  { id: 'PRC-14', num: 14, title: 'National Park Pass for residents', store: 'US National Park Service', price: 80.00, priceDisplay: '$80.00', image: 'assets/images/14-national-park-pass.jpg' },
  { id: 'PRC-15', num: 15, title: 'Milpitas to Embarcadero', store: 'BART', price: 9.65, priceDisplay: '$9.65', image: 'assets/images/15-bart-milpitas-embarcadero.jpg' }
];
