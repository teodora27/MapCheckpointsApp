import * as React from 'react';
import { useState } from 'react';
import Map, {Popup} from 'react-map-gl';
import {Marker} from 'react-map-gl';
import {Room} from "@material-ui/icons";
import "./App.css";
import axios from "axios";
import {format} from "timeago.js";
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const myStorage = window.localStorage;
  const [currentUser,setCurrentUser]=useState(myStorage.getItem("user"));
  const [newPlace, setNewPlace] = useState(null);
  const [name, setName] = useState(null);
  const [desc, setDesc] = useState(null);
  const [pins,setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 47,
    longitude: 2,
    zoom: 4,
  });


  React.useEffect(()=>{
    const getPins = async()=>{
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins()
  },[]);
  const flyToViewport = (lat, long) => {
    let step = 0;
    const steps = 25; // Number of steps in the transition
    const startLat = viewport.latitude;
    const startLong = viewport.longitude;
  
    const animateFly = () => {
      step += 1;
      const progress = step / steps;
      
      setViewport(prev => ({
        ...prev,
        latitude: startLat + (lat - startLat) * progress,
        longitude: startLong + (long - startLong) * progress
      }));
  
      if (step < steps) {
        requestAnimationFrame(animateFly);
      }
    };
  
    animateFly();
  };

  const handleMarkerClick = (id,lat,long) => {
    setCurrentPlaceId(id);
    flyToViewport(lat, long);
    //setViewport({ ...viewport, latitude: lat, longitude: long });
  };
  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat.toArray();
    console.log(e.lngLat);
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      name,
      desc,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };
  const handleLogout = () => {
    setCurrentUser(null);
    myStorage.removeItem("user");
  };

  return (
    <div className="App"style={{ width: '50vw', height: '100vh'}}>
      <Map
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11" 
        style={
          { 
            width: '100vw', 
            height: '100vh' 
          }
        }
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onMove={(evt) => setViewport(evt.viewState)}
        //onViewportChange={nextViewport => setViewport(nextViewport)}
        onDblClick={handleAddClick}
        
      >

        {pins.map(p=>(
          
        <React.Fragment key={p._id}>  
          <Marker
          latitude={p.lat} 
          longitude={p.long} 
          //offset={[-3.5 * viewState.latitude,-7 * viewport.zoom]}
          anchor="bottom"
          >
          <Room style={{fontSize:viewport.zoom*7, color: p.username===currentUser? "rgb(222, 49, 99)":"rgb(0,0,256)", cursor: "pointer"}}
          onClick={() => handleMarkerClick(p._id, p.lat,p.long)}
          /> 


        </Marker> 
        {p._id === currentPlaceId ? (
           
          <Popup 
          latitude={p.lat}
          longitude={p.long} 
          offset={[2,-20]}
          closeOnClick={false}  
          closeOnMove={false}  
          onClose={() => setCurrentPlaceId(null)}
          anchor="left"
          
          >
            <div className='card'>
            <label>Name</label>
            <h4 className='name'>{p.name}</h4>
            <label>Description</label>
              <p className='desc'>{p.desc}</p>
            <label>Information: </label> 
            <span className='username'>Created by <b>{p.username}</b></span>
            <span className='date'>{format(p.createdAt)}</span>
            </div>
        </Popup>

        ): null}

        </React.Fragment>
        ))}


        {newPlace ?(
          
          <Popup 
            latitude={newPlace.lat}
            longitude={newPlace.long} 
            offset={[2,-20]}
            closeOnClick={false}  
            closeOnMove={false}  
            onClose={() => setNewPlace(null)}
            anchor="left"
            >
            
            <div className='card'>
              <form onSubmit={handleSubmit}>
              <label>Name</label>
                <input
                  placeholder="Enter the name"
                  // autoFocus
                  onChange={(e) => setName(e.target.value)}
                />
              <label>Description</label>
                <textarea
                  placeholder="Say us something about this place."
                  onChange={(e) => setDesc(e.target.value)}
                />
              <button type="submit" className="submitButton">Add Pin</button>
              </form>
            </div>

            </Popup> 

          ): null }

      
        {currentUser ?(

        <button className="button logout"onClick={handleLogout}>Log out</button>  

        ):(

        <div className='buttons'>        
          <button className="button login" onClick={() => setShowLogin(true)}>Log in</button>          
          <button className="button register"onClick={() => setShowRegister(true)}>Register</button>          
        </div>

        )}
        {showRegister ?(
         <Register setShowRegister={setShowRegister}></Register> 
        ):null}
        {showLogin ?(
         <Login
         setShowLogin={setShowLogin}
         setCurrentUsername={setCurrentUser}
         myStorage={myStorage}
         ></Login>
        ):null}
        

      </Map> 
    </div>
  );
}

export default App;
