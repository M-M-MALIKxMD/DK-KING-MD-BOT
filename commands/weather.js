const axios  = require('axios');
const config = require('../config');

module.exports = {
  name: 'weather',
  alias: ['climate', 'forecast'],
  description: 'Get weather for a city',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}weather <city>\n\nExample: ${config.prefix}weather Karachi\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    try {
      const { data } = await axios.get(
        `https://wttr.in/${encodeURIComponent(body)}?format=j1`,
        { timeout: 15000 }
      );

      const current = data.current_condition?.[0];
      const area    = data.nearest_area?.[0];
      const cityName = area?.areaName?.[0]?.value || body;
      const country  = area?.country?.[0]?.value || '';

      const temp    = current?.temp_C;
      const feels   = current?.FeelsLikeC;
      const humidity = current?.humidity;
      const wind    = current?.windspeedKmph;
      const desc    = current?.weatherDesc?.[0]?.value;
      const uv      = current?.uvIndex;

      const emojis  = { Sunny: '☀️', Clear: '🌙', Cloudy: '☁️', Rain: '🌧️', Snow: '❄️', Thunder: '⛈️', Fog: '🌫️', Wind: '💨' };
      const wEmoji  = Object.keys(emojis).find(k => desc?.includes(k)) ? emojis[Object.keys(emojis).find(k => desc?.includes(k))] : '🌡️';

      await sock.sendMessage(jid, {
        text: `${wEmoji} *Weather in ${cityName}, ${country}*\n\n🌡️ Temperature: *${temp}°C* (Feels like ${feels}°C)\n☁️ Condition: ${desc}\n💧 Humidity: ${humidity}%\n💨 Wind: ${wind} km/h\n☀️ UV Index: ${uv}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });

    } catch {
      await sock.sendMessage(jid, {
        text: `❌ Could not get weather for *${body}*. Check the city name.\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
