import "./App.css";
import apiClient from "./api-client";
import React, { useState, useEffect } from "react";
import {
  Marker,
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";

import orlenIcon from "./Icons/red.ico";
import lotosIcon from "./Icons/yellow.ico";
import bpIcon from "./Icons/green.ico";
import defaultIcon from "./Icons/default.png";
import blackStar from "./Icons/star.png";
import outlineStar from "./Icons/outlineStar.png";
import filledStar from "./Icons/filledStar.png";
import commentsIcon from "./Icons/comments.png";
import addressIcon from "./Icons/address.png";
import navigateIcon from "./Icons/route.png";
import closeIcon from "./Icons/close.png";

function App() {
  const [stations, setStations] = useState([]);
  const [stationComments, setStationComments] = useState([]);
  const [stationDetails, setStationDetails] = useState("");
  const [assessed, setAssedded] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [helpText, setHelpText] = useState("");
  const [directionService, setDirectionService] = useState(null);
  const [customRoute, setCustomRoute] = useState(0); // 0 -> no interaction, 1 -> starting point, 2 -> end point, 3 -> new station point
  const [startingPoint, setStartingPoint] = useState(false);
  const [startingPosition, setStartingPosition] = useState("");
  const [choosenPosition, setChoosenPosition] = useState("");
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [map, setMap] = useState(null);

  useEffect(() => {
    getAllStations();
    authorize();
  }, []);

  const center = {
    lat: 52.3391950875,
    lng: 16.8752836125,
  };

  const containerStyle = {
    position: "absolute",
    width: "100%",
    height: "940px",
  };
  const OPTIONS = {
    disableAutoPan: true,
    maxZoom: 15,
    minZoom: 5,
  };

  function getIcon(station) {
    switch (station.name) {
      case "Orlen":
        return orlenIcon;
      case "Lotos":
        return lotosIcon;
      case "BP":
        return bpIcon;
      default:
        return defaultIcon;
    }
  }

  function getPosition(station) {
    return {
      lat: station.lat,
      lng: station.lon,
    };
  }

  const { isLoaded } = useJsApiLoader({
    id: "gasstations-346018",
    googleMapsApiKey: "AIzaSyDMcE5tLJG1W3_SZJwMAtHb9X-CvmAOiQI",
  });

  function getAllStations() {
    apiClient.getAllStations().then(function (data) {
      for (let i = 0; i < data.length; i++) {
        setStations((stations) => [...stations, data[i]]);
      }
    });
  }

  function authorize() {
    apiClient
      .authorize()
      .then(function (resp) {
        if (resp.status === 200) {
          setAuthenticated(true);
          setUsername(resp.data.username);
        }
      })
      .catch((error) => {
        setAuthenticated(false);
      });
  }

  function loadStationDetails(id) {
    apiClient
      .getStationDetails(id)
      .then(function (data) {
        if (data.user_grade === null) setAssedded(false);
        else setAssedded(true);
        setStationDetails(data);
      })
      .catch((error) => {});
  }

  function loadStationComments(id) {
    apiClient
      .getStationComments(id)
      .then(function (data) {
        setStationComments([]);
        for (let i = 0; i < data.length; i++) {
          setStationComments((stationComments) => [
            ...stationComments,
            data[i],
          ]);
        }
      })
      .catch((error) => {});
  }

  function showPopup(station) {
    loadStationDetails(station.id);
    loadStationComments(station.id);
    document.getElementById("Popup").style.display = "flex";
    document.getElementById("pb95").value = "";
    document.getElementById("pb98").value = "";
    document.getElementById("ON").value = "";
    document.getElementById("GAS").value = "";
  }

  function sendGrade(grade) {
    const data = new FormData();

    data.append("stationId", stationDetails.id);
    data.append("grade", grade);
    apiClient.sendGrade(data);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    updateFuelPrice(
      event.target.pb95.value,
      event.target.pb98.value,
      event.target.ON.value,
      event.target.GAS.value
    );
  };

  function updateFuelPrice(pb95, pb98, on, gas) {
    const data = new FormData();

    data.append("id", stationDetails.id);

    if (pb95 !== "") {
      data.append("pb95", pb95);
    }
    if (pb98 !== "") {
      data.append("pb98", pb98);
    }
    if (on !== "") {
      data.append("diesel", on);
    }
    if (gas !== "") {
      data.append("gas", gas);
    }

    apiClient
      .updateFuelPrice(data)
      .then(setAuthenticated(true))
      .catch((error) => {
        if (error.response.status === 401) {
          setAuthenticated(false);
        }
      });
  }

  const unfillStars = (event) => {
    let s1 = document.getElementById("s1");
    let s2 = document.getElementById("s2");
    let s3 = document.getElementById("s3");
    let s4 = document.getElementById("s4");
    let s5 = document.getElementById("s5");

    s1.src = outlineStar;
    s2.src = outlineStar;
    s3.src = outlineStar;
    s4.src = outlineStar;
    s5.src = outlineStar;
  };

  function fill(count) {
    let s1 = document.getElementById("s1");
    let s2 = document.getElementById("s2");
    let s3 = document.getElementById("s3");
    let s4 = document.getElementById("s4");
    let s5 = document.getElementById("s5");

    switch (count) {
      case 1:
        s1.src = filledStar;
        break;
      case 2:
        s1.src = filledStar;
        s2.src = filledStar;
        break;
      case 3:
        s1.src = filledStar;
        s2.src = filledStar;
        s3.src = filledStar;
        break;
      case 4:
        s1.src = filledStar;
        s2.src = filledStar;
        s3.src = filledStar;
        s4.src = filledStar;
        break;
      case 5:
        s1.src = filledStar;
        s2.src = filledStar;
        s3.src = filledStar;
        s4.src = filledStar;
        s5.src = filledStar;
        break;
      default:
        break;
    }
  }
  function getGradeIcon(iconNumber) {
    if (iconNumber <= stationDetails.user_grade) return filledStar;
    else return outlineStar;
  }
  function removeGrade() {
    setAssedded(false);
  }

  const showRegisterPopup = (event) => {
    event.preventDefault();
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "flex";
  };

  const showLoginPopup = (event) => {
    event.preventDefault();
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "flex";
  };

  async function setRouteToStation(position) {
    const userPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    const destinationCoords = {
      lat: stationDetails.lat,
      lng: stationDetails.lon,
    };

    const results = await directionService.route({
      origin: userPosition,
      destination: destinationCoords,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    setRoute(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  async function setUserRoute(destination) {
    const results = await directionService.route({
      origin: startingPosition,
      destination: destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });
    setStartingPoint(false);
    setRoute(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function navigate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setRouteToStation);
    }
  }

  function Assessed() {
    return (
      <>
        <div className="stars">
          <img
            id="s1"
            alt="description"
            className="gradeStar"
            onClick={() => removeGrade()}
            src={getGradeIcon(1)}
          ></img>
          <img
            id="s2"
            alt="description"
            className="gradeStar"
            onClick={() => removeGrade()}
            src={getGradeIcon(2)}
          ></img>
          <img
            id="s3"
            alt="description"
            className="gradeStar"
            onClick={() => removeGrade()}
            src={getGradeIcon(3)}
          ></img>
          <img
            id="s4"
            alt="description"
            className="gradeStar"
            onClick={() => removeGrade()}
            src={getGradeIcon(4)}
          ></img>
          <img
            id="s5"
            alt="description"
            className="gradeStar"
            onClick={() => removeGrade()}
            src={getGradeIcon(5)}
          ></img>
        </div>
        <label className="hintLabel" onClick={() => removeGrade()}>
          Click to change your rate
        </label>
      </>
    );
  }
  function NotAssessed() {
    return (
      <>
        <div className="stars">
          <img
            id="s1"
            onMouseEnter={() => fill(1)}
            onMouseLeave={() => unfillStars()}
            onClick={() => sendGrade(1)}
            alt="description"
            className="gradeStar"
            src={outlineStar}
          ></img>
          <img
            id="s2"
            onMouseEnter={() => fill(2)}
            onMouseLeave={() => unfillStars()}
            onClick={() => sendGrade(2)}
            alt="description"
            className="gradeStar"
            src={outlineStar}
          ></img>
          <img
            id="s3"
            onMouseEnter={() => fill(3)}
            onMouseLeave={() => unfillStars()}
            onClick={() => sendGrade(3)}
            alt="description"
            className="gradeStar"
            src={outlineStar}
          ></img>
          <img
            id="s4"
            onMouseEnter={() => fill(4)}
            onMouseLeave={() => unfillStars()}
            onClick={() => sendGrade(4)}
            alt="description"
            className="gradeStar"
            src={outlineStar}
          ></img>
          <img
            id="s5"
            onMouseEnter={() => fill(5)}
            onMouseLeave={() => unfillStars()}
            onClick={() => sendGrade(5)}
            alt="description"
            className="gradeStar"
            src={outlineStar}
          ></img>
        </div>
        <label className="hintLabel">Rate the station</label>
      </>
    );
  }

  function NotAuthenticated() {
    return (
      <>
        <div className="stars">
          <img
            id="s1"
            alt="description"
            className="gradeStar"
            src={outlineStar}
          ></img>
          <img
            id="s2"
            alt="description"
            className="gradeStar"
            src={outlineStar}
          ></img>
          <img
            id="s3"
            alt="description"
            className="gradeStar"
            src={outlineStar}
          ></img>
          <img
            id="s4"
            alt="description"
            className="gradeStar"
            src={outlineStar}
          ></img>
          <img
            id="s5"
            alt="description"
            className="gradeStar"
            src={outlineStar}
          ></img>
        </div>
      </>
    );
  }

  function CommentPopup() {
    const maxLetters = 150;
    const [lettersCount, setLettersCount] = useState(0);
    const [description, setDescription] = useState(" ");

    function countLetters(event) {
      setDescription(event.target.value);
      setLettersCount(event.target.value.length);
    }

    function addComment() {
      const data = new FormData();

      data.append("nickname", username);
      data.append("text", description);
      data.append("stationId", stationDetails.id);

      apiClient
        .addComment(data)
        .then(function (data) {
          loadStationComments(stationDetails.id);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            setAuthenticated(false);
          }
        });
    }

    return (
      <>
        <div id="comP" className="commentPopup">
          <div className="top">
            <img
              id="close"
              alt="description"
              className="closeIcon"
              onClick={() =>
                (document.getElementById("comP").style.display = "none")
              }
              src={closeIcon}
            ></img>
          </div>
          <div className="middle">
            <textarea
              rows="5"
              type="text"
              maxLength="150"
              className="descriptionInput"
              placeholder="Comment..."
              onChange={countLetters}
            />
          </div>
          <div className="bottom">
            <label className="lettersCount">
              {lettersCount}/{maxLetters}
            </label>
            <button onClick={addComment} className="sendButton">
              {" "}
              Send{" "}
            </button>
          </div>
        </div>
      </>
    );
  }

  function NewStationPopup() {
    const handleSubmit = (event) => {
      event.preventDefault();
      addNewStation(
        event.target.name.value,
        event.target.address.value,
        event.target.pb95.value,
        event.target.pb98.value,
        event.target.on.value,
        event.target.gas.value
      );
    };

    function addNewStation(name, address, pb95, pb98, on, gas) {
      const data = new FormData();
      data.append("name", name);
      data.append("address", address);
      data.append("lon", choosenPosition.lng);
      data.append("lat", choosenPosition.lat);
      data.append("pb95", pb95);
      data.append("pb98", pb98);
      data.append("diesel", on);
      data.append("gas", gas);

      apiClient.addNewStation(data).then(function (resp) {
        if (resp.status === 200) {
          setShowHelp(false);
          setStations((stations) => [...stations, resp.data]);
          setChoosenPosition(null);
          setCustomRoute(0);
        }
      });
    }

    function closeNewStationPopup() {
      setChoosenPosition(false);
      document.getElementById("newS").style.display = "none";
      setShowHelp(false);
      setCustomRoute(0);
    }

    return (
      <>
        <div id="newS" className="newStationPopup">
          <div className="top">
            New station
            <img
              id="close"
              alt="description"
              className="closeIcon"
              onClick={closeNewStationPopup}
              src={closeIcon}
            ></img>
          </div>
          <div className="middle">
            <form onSubmit={handleSubmit}>
              <input
                className="addressInput"
                type="text"
                name="name"
                placeholder="Name"
              ></input>
              <input
                className="addressInput"
                type="text"
                name="address"
                placeholder="Address"
              ></input>
              <input
                className="dataInput"
                type="number"
                step="0.01"
                name="pb95"
                placeholder="Pb95"
              ></input>
              <input
                className="dataInput"
                type="number"
                step="0.01"
                name="pb98"
                placeholder="Pb98"
              ></input>
              <input
                className="dataInput"
                type="number"
                step="0.01"
                name="on"
                placeholder="ON"
              ></input>
              <input
                className="dataInput"
                type="number"
                step="0.01"
                name="gas"
                placeholder="GAS"
              ></input>
              <button className="submitButton2" type="submit">
                Submit
              </button>
            </form>
          </div>
          <div className="bottom"></div>
        </div>
      </>
    );
  }

  function EditField() {
    return (
      <div className="Middle">
        <div className="fuel">
          <form className="fuelForm" onSubmit={handleSubmit}>
            <div className="fuelPrice">
              <div className="left">Pb95 -</div>
              <div className="right">
                <input
                  id="pb95"
                  type="number"
                  step="0.01"
                  name="pb95"
                  className="priceInput"
                  placeholder={stationDetails.pb95}
                />
              </div>
            </div>
            <div className="fuelPrice">
              <div className="left">Pb98 -</div>
              <div className="right">
                <input
                  id="pb98"
                  type="number"
                  step="0.01"
                  name="pb98"
                  className="priceInput"
                  placeholder={stationDetails.pb98}
                />
              </div>
            </div>

            <div className="fuelPrice">
              <div className="left">ON -</div>
              <div className="right">
                <input
                  id="ON"
                  type="number"
                  step="0.01"
                  name="ON"
                  className="priceInput"
                  placeholder={stationDetails.diesel}
                />
              </div>
            </div>
            <div className="fuelPrice">
              <div className="left">GAS -</div>
              <div className="right">
                <input
                  id="GAS"
                  type="number"
                  step="0.01"
                  name="GAS"
                  className="priceInput"
                  placeholder={stationDetails.gas}
                />
              </div>
            </div>
            {authenticated ? (
              <>
                <button className="submitButton" type="submit">
                  Submit
                </button>
                <button
                  onClick={() =>
                    (document.getElementById("comP").style.display = "flex")
                  }
                  className="commentButton"
                >
                  Comment
                </button>
              </>
            ) : (
              <label
                className="loginLabel"
                onClick={() =>
                  (document.getElementById("login").style.display = "flex")
                }
              >
                {" "}
                Login to interact
              </label>
            )}
          </form>
        </div>
      </div>
    );
  }

  function Comments() {
    return (
      <div className="Bottom">
        <div className="info">
          <label>Comments</label>
        </div>
        <div className="comments">
          {stationComments.map((comment) => (
            <div className="comment" key={comment.id}>
              <div className="nickname">{comment.nickname}</div>
              <div className="text">{comment.text}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function Details() {
    return (
      <div className="Top">
        <div className="title">
          <label>{stationDetails.name}</label>
        </div>
        <div className="address">
          <img
            alt="description"
            className="addressIcon"
            src={addressIcon}
          ></img>
          <label className="l1">{stationDetails.address}</label>
        </div>
        <div className="stats">
          <div className="left">
            <div className="data">
              <img alt="description" className="starIcon" src={blackStar}></img>
              {stationDetails.average_grade}
            </div>
          </div>
          <div className="left">
            <div className="data">
              <img
                alt="description"
                className="commentsIcon"
                src={commentsIcon}
              ></img>
              {stationDetails.comments_count}
            </div>
          </div>
          <div className="right">
            <div className="data2">
              <img
                alt="description"
                className="navigateIcon"
                src={navigateIcon}
                onClick={navigate}
              ></img>
            </div>
          </div>
        </div>
        {authenticated ? (
          <div className="userGrade">
            {assessed ? <Assessed /> : <NotAssessed />}
          </div>
        ) : (
          <NotAuthenticated />
        )}
      </div>
    );
  }

  function RegisterPopup() {
    const [errorText, setErrorText] = useState("");
    const handleRegister = (event) => {
      event.preventDefault();

      register(event.target.username.value, event.target.password.value);
    };

    function register(username, password) {
      const data = new FormData();
      data.append("username", username);
      data.append("password", password);

      apiClient
        .register(data)
        .then(function (resp) {
          if (resp.status === 200) {
            document.getElementById("register").style.display = "none";
            document.getElementById("login").style.display = "flex";
          }
        })
        .catch((error) => {
          setErrorText(error.response.data.error);
        });
    }

    return (
      <div id="register" className="register">
        <div className="top">
          <img
            id="close"
            alt="description"
            className="closeIconLogin"
            onClick={() => {
              document.getElementById("register").style.display = "none";
              setErrorText("");
            }}
            src={closeIcon}
          ></img>
        </div>
        <div className="middle">
          <form className="fuelForm" onSubmit={handleRegister}>
            <input
              className="credentialsInput"
              type="text"
              name="username"
              placeholder="Username"
            ></input>
            <input
              className="credentialsInput"
              type="password"
              name="password"
              placeholder="Password"
            ></input>
            <input
              className="credentialsInput"
              type="password"
              name="rPassword"
              placeholder="Repeat password"
            ></input>
            <div className="buttons">
              <button className="loginButton" type="submit">
                Register
              </button>
              <button className="loginButton" onClick={showLoginPopup}>
                Login
              </button>
            </div>
          </form>
        </div>
        <div className="bottom">
          <label className="errorLabel">{errorText}</label>
        </div>
      </div>
    );
  }

  function LoginPopup() {
    const [errorText, setErrorText] = useState("");
    const handleLogin = (event) => {
      event.preventDefault();
      login(event.target.username.value, event.target.password.value);
    };

    function login(username, password) {
      const data = new FormData();
      data.append("username", username);
      data.append("password", password);

      apiClient
        .login(data)
        .then(function (resp) {
          if (resp.status === 200) {
            setAuthenticated(true);
            setUsername(resp.data.username);
            localStorage.setItem("acces_token", resp.data.acces_token);
          }
        })
        .catch((error) => {
          setErrorText("Wrong credentials");
        });
    }

    return (
      <div id="login" className="login">
        <div className="top">
          <img
            id="close"
            alt="description"
            className="closeIconLogin"
            onClick={() => {
              document.getElementById("login").style.display = "none";
              setErrorText("");
            }}
            src={closeIcon}
          ></img>
        </div>
        <div className="middle">
          <form className="fuelForm" onSubmit={handleLogin}>
            <input
              className="credentialsInput"
              type="text"
              name="username"
              placeholder="Username"
            ></input>
            <input
              className="credentialsInput"
              type="password"
              name="password"
              placeholder="Password"
            ></input>
            <div className="buttons">
              <button className="loginButton" type="submit">
                Login
              </button>
              <button className="loginButton" onClick={showRegisterPopup}>
                {" "}
                Register
              </button>
            </div>
          </form>
        </div>
        <div className="bottom">
          {" "}
          <label className="errorLabel">{errorText}</label>
        </div>
      </div>
    );
  }

  function Help() {
    function hideHelp() {
      setShowHelp(false);
      setStartingPoint(false);
      setChoosenPosition(false);
      setCustomRoute(0);
    }

    return (
      <div id="help" className="help">
        <label>{helpText} </label>
        <button className="cancelButton1" onClick={hideHelp}>
          Cancel
        </button>
      </div>
    );
  }

  function UserDetails() {
    function openNewStationHelp() {
      setHelpText("Select place on map");
      setCustomRoute(3);
      setShowHelp(true);
    }

    function openNewRouteHelp() {
      setHelpText("Select starting point");
      setCustomRoute(1);
      setShowHelp(true);
    }

    function logout() {
      apiClient
        .logout()
        .then(function (resp) {
          localStorage.setItem("acces_token", "");
          setAuthenticated(false);
        })
        .catch((error) => {});
    }

    return (
      <div className="userDetails">
        <label className="username"> {username}</label>
        <button className="logoutButton" onClick={openNewRouteHelp}>
          Custom route
        </button>
        <button className="simpleButton" onClick={openNewStationHelp}>
          Add station
        </button>
        <button className="simpleButton" onClick={logout}>
          Logout
        </button>
      </div>
    );
  }
  function RouteDetails() {
    function cancelRoute() {
      setRoute(false);
      setDistance(false);
      setDuration(false);
    }
    return (
      <div className="routeDetails">
        <div className="left">Distance: {distance}</div>
        <div className="right">Estimated travel time: {duration} </div>
        <button className="cancelButton" onClick={cancelRoute}>
          Cancel
        </button>
      </div>
    );
  }

  const onLoad = React.useCallback(function callback(map) {
    const service = new window.google.maps.DirectionsService();
    setDirectionService(service);
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onClick = (e) => {
    const position = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    if (customRoute === 1) {
      setStartingPosition(position);
      setStartingPoint(true);
      setHelpText("Select ending point");
      setCustomRoute(2);
    }

    if (customRoute === 2) {
      setShowHelp(false);
      setCustomRoute(0);
      setUserRoute(position);
    }
    if (customRoute === 3) {
      setChoosenPosition(position);
      document.getElementById("newS").style.display = "flex";
      document.getElementById("help").style.display = "none";
    }
  };

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        options={OPTIONS}
        defaultCenter={center}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={(e) => onClick(e)}
      >
        <div>
          {stations.map((p) => {
            return (
              <div>
                <Marker
                  key={p.id + 1}
                  onClick={() => showPopup(p)}
                  icon={getIcon(p)}
                  position={getPosition(p)}
                ></Marker>
              </div>
            );
          })}
        </div>
        <></>
        {route && <DirectionsRenderer icon={blackStar} directions={route} />}
        {startingPoint && <Marker position={startingPosition}></Marker>}
        {choosenPosition && <Marker position={choosenPosition}></Marker>}
      </GoogleMap>
      <div id="Popup" className="Popup">
        <Details />
        <EditField />
        <Comments />
      </div>
      <CommentPopup />
      <LoginPopup />
      <RegisterPopup />
      {authenticated ? <UserDetails /> : null}
      {distance ? <RouteDetails /> : null}
      <NewStationPopup />
      {showHelp ? <Help /> : null}
    </div>
  ) : (
    <></>
  );
}

export default App;
