const { default: axios } = require("axios");
const format = require("date-fns/format");

async function main() {
  const date = new Date();
  const forecast = await fetchForecast(date);
  process.stdout.write(formatForecast({ date, ...forecast }));
}

async function fetchForecast(date) {
  const dateString = format(date, "yyyy-MM-dd");

  const res = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
    params: {
      latitude: 35.6785,
      longitude: 139.6823,
      daily: ["weathercode", "temperature_2m_max", "temperature_2m_min"],
      timezone: "Asia/Tokyo",
      start_date: dateString,
      end_date: dateString,
    },
  });

  const data = res.data;

  const dateIndex = data.daily.time.findIndex((d) => d === dateString);
  if (dateIndex < 0) {
    throw new Error(`No date: ${dateString}`);
  }

  return {
    weatherCode: data.daily.weathercode[dateIndex],
    tempMax: data.daily.temperature_2m_max[dateIndex],
    tempMin: data.daily.temperature_2m_min[dateIndex],
  };
}

function formatForecast({ date, weatherCode, tempMin, tempMax }) {
  const dateString = format(date, "M月d日");
  return `${dateString}の東京の天気は、${toWeatherName(
    weatherCode
  )}、最高気温は${tempMax}度、最低気温は${tempMin}度でしょう。`;
}

function toWeatherName(weatherCode) {
  switch (weatherCode) {
    case 0:
      return "晴天";
    case (1, 2, 3):
      return "晴れ時々曇り";
    case (45, 48):
      return "霧";
    case (51, 53, 55):
      return "霧雨";
    case (56, 57):
      return '凍結'
    case (61, 63, 65):
      return '雨'
    case (66, 67):
      return '凍つく雨'
    case (71, 73, 75):
      return '雪'
    case 77:
      return '雪粒'
    case (80, 81, 82):
      return 'にわか雨'
    case (85, 86):
      return '雪が降ったり止んだり'
    case 95:
      return '雷雨'
    case (96, 99):
      return 'あられ'
    default:
      return `不明(${weatherCode})`;
  }
}

main();
