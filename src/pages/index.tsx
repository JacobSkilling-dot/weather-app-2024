import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css';

const weatherImages: {
  [key: string]: string;
} = {
  Clear: '/images/Sun.png',
  Rain: '/images/Rain.png',
  Clouds: '/images/Cloud.png',
  Wind: '/images/Wind.png',
  Suncloud: '/images/Suncloud.png',
  Snow: '/images/Snow.png',
};

interface WeatherData {
  list?: {
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: {
      main: string;
      description: string;
    }[];
    wind: {
      speed: number;
    };
    clouds: {
      all: number;
    };
    image: string;
  }[];
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = "d6685ecac4972379327e18b9bd7206bd";
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Chicago&appid=${apiKey}`)
      .then(response => response.json())
      .then((json: WeatherData) => {
        if (json.list) {
          const dataWithImages = json.list.map((item: any) => ({
            ...item,
            image: getImageUrl(item.weather[0].main),
          }));
          setWeatherData({ list: dataWithImages });
          setLoading(false);
        } else {
          setError("Weather data not available");
          setLoading(false);
        }
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);


  const getImageUrl = (weatherCondition: string) => {
    return weatherImages[weatherCondition] || '/images/default.png'; 
  };

  return (
    <>
      <Head>
        <title>5-Day Chicago Weather Forecast</title>
        <meta name="description" content="5 Day Chicago Weather Forecast" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className={styles.main}>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {weatherData && weatherData.list && (
          <div>

            <h1>5-Day Chicago Weather Forecast</h1>
            <ul className={styles.gridContainer}>
              {weatherData.list.map((a: any) => (
                <li key={a.dt} className={styles.gridItem}>
                  <div className={styles.textbox}>Date: {a.dt_txt}</div>
                  <div className={styles.textbox}>Weather: {a.weather[0].main}</div>
                  <div className={styles.textbox}>
                    <img src={a.image}
                      alt={a.weather[0].main}
                      className={styles.weatherImage}
                      style={{ width: '80px', height: '80px' }}></img>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
