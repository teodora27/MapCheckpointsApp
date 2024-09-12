import * as React from 'react';
import { useState } from 'react';
import Map, {Popup} from 'react-map-gl';
import {Marker} from 'react-map-gl';
import {Room} from "@material-ui/icons";
import "./App.css";
import axios from "axios";
import {format} from "timeago.js";

function App() {
  const currentUser="ana_blandiana";

  const [pins,setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
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

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
    // setViewport({ ...viewport, latitude: lat, longitude: long });
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
          onClick={() => handleMarkerClick(p._id)}
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

      </Map> 
    </div>
  );
}

export default App;
