const config = require('../config');

module.exports = {
  name: 'bmi',
  alias: ['bodymass'],
  description: 'Calculate Body Mass Index (BMI)',
  async execute({ sock, msg, jid, args }) {
    const [weight, height] = args.map(Number);
    if (!weight || !height) {
      return sock.sendMessage(jid, {
        text: `❌ Usage: ${config.prefix}bmi <weight kg> <height cm>\n\nExample: ${config.prefix}bmi 70 175\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    const h       = height / 100;
    const bmi     = (weight / (h * h)).toFixed(1);
    const category = bmi < 18.5 ? '📉 Underweight' : bmi < 25 ? '✅ Normal weight' : bmi < 30 ? '⚠️ Overweight' : '❗ Obese';

    await sock.sendMessage(jid, {
      text: `🏋️ *BMI Calculator*\n\n⚖️ Weight: ${weight} kg\n📏 Height: ${height} cm\n\n📊 BMI: *${bmi}*\n${category}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
