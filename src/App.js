import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SearchEngine from "./components/SearchEngine";
import Forecast from "./components/Forecast";
import Feedbacks from "./components/Feedbacks";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./App.css";

import { db, storage } from "./firebase-config";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function App() {
  const initialState = {
    name: "",
    message: "",
    Image: null,
  };

  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
  });
  const [feedback, setFeedback] = useState([]);
  const [city, setCity] = useState("solapur");

  const [{ name, message, Image }, setState] = useState(initialState);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "Image") {
      setState((prevState) => ({ ...prevState, Image: files[0] }));
    } else {
      setState((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const clearState = () => setState(initialState);

  const toDate = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const currentDate = new Date();
    const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${
      months[currentDate.getMonth()]
    }`;
    return date;
  };

  const feedbacksCollection = collection(db, "feedbacks");

  const search = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setQuery("");
      setWeather({ ...weather, loading: true });
      fetchWeatherData(query);
    }
  };

  const fetchWeatherData = (city) => {
    const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
    const url = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;

    axios
      .get(url)
      .then((res) => {
        console.log("res", res);
        setWeather({ data: res.data, loading: false, error: false });
        setCity(res.data.city);
      })
      .catch((error) => {
        setWeather({ ...weather, data: {}, error: true });
        setQuery("");
        console.log("error", error);
      });
  };

  const changeCity = () => {
    fetchWeatherData(query);
  };

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
        const url = `https://api.shecodes.io/weather/v1/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`;

        axios
          .get(url)
          .then((res) => {
            console.log("res", res);
            setWeather({ data: res.data, loading: false, error: false });
            setCity(res.data.city);
          })
          .catch((error) => {
            setWeather({ ...weather, data: {}, error: true });
            console.log("error", error);
          });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const addFeedback = async (e) => {
    e.preventDefault();
    try {
      if (Image) {
        const imageRef = ref(storage, `images/${Image.name}`);
        await uploadBytes(imageRef, Image);
        const imageUrl = await getDownloadURL(imageRef);
        const currentDate = new Date();
        const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;  
        const docRef = await addDoc(feedbacksCollection, {
          name,
          message,
          city,
          Image: imageUrl,
          date: formattedDate,
        });
        console.log("Document written with ID: ", docRef.id);

        setFeedback((prevFeedback) => [
          ...prevFeedback,
          { id: docRef.id, name, message, city, Image: imageUrl },
        ]);

        clearState();
        fileInputRef.current.value = "";
      } else {
        console.error("No image selected");
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const fetchFeedbacks = async (city) => {
    const feedbackss = await getDocs(feedbacksCollection);
    const filteredFeedbacks = feedbackss.docs
      .filter((doc) => doc.data().city === city)
      .map((doc) => ({ id: doc.id, ...doc.data() }));

    setFeedback(filteredFeedbacks);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchWeatherData("solapur");
      await fetchFeedbacks("solapur");
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchFeedbacks(city);
  }, [city]);

  return (
    <div className="App">
      <SearchEngine
        query={query}
        setQuery={setQuery}
        search={search}
        changeCity={changeCity}
        getCurrentLocationWeather={getCurrentLocationWeather}
      />

      {weather.loading && (
        <>
          <br />
          <br />
          <h4>Searching..</h4>
        </>
      )}

      {weather.error && (
        <>
          <br />
          <br />
          <span className="error-message">
            <span style={{ fontFamily: "font" }}>
              Sorry city not found, please try again.
            </span>
          </span>
        </>
      )}

      {weather && weather.data && weather.data.condition && (
        <Forecast weather={weather} toDate={toDate} />
      )}

      <Feedbacks
        feedback={feedback}
        addFeedback={addFeedback}
        handleChange={handleChange}
        name={name}
        message={message}
        fileInputRef={fileInputRef}
      />
    </div>
  );
}

export default App;

