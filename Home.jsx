import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { useSpeechRecognition } from 'react-speech-recognition';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import MAP from '../assets/MAP.png'
import NAVIER from '../assets/Navier-vmake.mp4';
import amisha from'../assets/amisha.jpg'
import chai from '../assets/chaitanya.jpg'
import atman from '../assets/atman.jpg'
import sonu from '../assets/SONU.png'
import sush from '../assets/sush.jpg'
import Bidhan from '../assets/Bidhan.jpg'
import { BiSolidNavigation } from "react-icons/bi";
import Footer from './footer';
import {motion} from 'framer-motion';
import { GiStairsGoal } from "react-icons/gi";
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import LocomotiveScroll from 'locomotive-scroll';
import './locomotive.css'

const geocodeLocation = async (query) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1`);
    const data = await response.json();
    if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } else {
        return null;
    }
};


const teamMembers = [
    {
      imgs: Bidhan,
      name: 'Bidhan Ranjan Bhoi',
      desc: 'React and Backend Development. Implemented visualizations, ensuring all interactive elements function smoothly.',
    },
    {
      imgs: sonu,
      name: 'Swarup Kumar Rath',
      desc: 'React and Backend Integration. Assisted in integrating collected JSON files, handling animations for visualizations.',
    },
    {
      imgs: sush,
      name: 'Sushree Sangita Das',
      desc: 'Data Collection and Modeling. Collected data from APIs, built a model using algorithms for sea route calculations.',
    },
    {
      imgs: amisha,
      name: 'Amisha Padhy',
      desc: 'Path Integration. Used API details to match paths and build JSON files for integrating routes into the project.',
    },
    {
      imgs: chai,
      name: 'Peddapati Chaitanya',
      desc: 'Data Collection and Visualization. Collected data and created visualizations using Power BI.',
    },
    {
      imgs: atman,
      name: 'Aum Atman Behera',
      desc: 'Research and Reporting. Conducted research, prepared reports, and integrated collected data.',
    },
  ];



const Home = () => {

  //  const scrollRef = useRef(null);
  //  useEffect(()=>{
  //   const scroll = new LocomotiveScroll({
  //     el: scrollRef.current,
  //     smooth : true
  //    })
  //    return ()=>{scroll.destroy()}
  //  },[])
  


  
  useEffect(() => {
    // Define Watson Assistant Chat options
    const initializeChat = () => {
      window.watsonAssistantChatOptions = {
        integrationID: "0f8a7f73-3dbd-446e-8533-c747cb4ade3f", // The ID of this integration
        region: "us-south", // The region your integration is hosted in
        serviceInstanceID: "bf228013-595d-4273-a25e-23c090f40746", // The ID of your service instance
        onLoad: async (instance) => {
          await instance.render();
        },
      };
    };

    initializeChat();

    // Dynamically load the Watson Assistant Chat script
    const script = document.createElement("script");
    script.src =
      "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" +
      (window.watsonAssistantChatOptions.clientVersion || "latest") +
      "/WatsonAssistantChatEntry.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Remove the script and reset chat options on cleanup
      document.head.removeChild(script);
      delete window.watsonAssistantChatOptions;
    };
  }, []); // Dependencies can be added to reinitialize when needed


    const [activeView, setActiveView] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
    const [searchLocation, setSearchLocation] = useState(null);
    const [portsData, setPortsData] = useState([]);

    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition({
        onResult: (result) => {
            setSearchQuery(result);
        }
    });

    const handleSearch = async () => {
        const coords = await geocodeLocation(searchQuery);
        if (coords) {
            setMapCenter(coords);
            setSearchLocation(coords);
        } else {
            alert('Click the Search Button to see the location');
        }
    };

    const layers = {
        default: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        satellite: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        ocean: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
    };

    const fetchPortsData = async () => {
        try {
            const response = await fetch('/ports.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPortsData(data);
        } catch (error) {
            console.error('Error loading ports data:', error);
        }
    };

    useEffect(() => {
        fetchPortsData();
    }, []);

    const icons = L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });

    const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });



    const videoRef = useRef(null);
    // Handler to scroll to the video section
    const scrollToVideo = () => {
      if (videoRef.current) {
        videoRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // ref={scrollRef} className='scroll-container'

    return (
      <>
        <div>
            <div className='min-h-screen w-full' style={{ backgroundColor: 'rgba(118, 198, 204, 1)' }}>
            <div className='flex flex-wrap   justify-around py-8 px-6'>
            <div className='sm:mt-32 sm:mb-16  mb-16 mt-10 lg:text-left sm:text-center'>
             <motion.p 
              whileInView={{ opacity: 1, y: 0}}
              initial={{ opacity: 0, y:100 }}
              transition={{ duration: 1 }}
             className='lg:text-4xl text-4xl  tracking-widest font-bold' style={{color:"rgb(8,73,98)"}}>
                Welcome To the World of 
             </motion.p>
             <motion.p 
              whileInView={{ opacity: 1, y:0}}
              initial={{ opacity: 0, y:100 }}
              transition={{ duration: 1 }}
             className='lg:text-8xl text-5xl mt-4 sm:mt-0 font-bold tracking-widest' style={{color:"rgba(246,244,231,255)"}} >
                NAVIER
             </motion.p>
             <motion.p 
               whileInView={{ opacity: 1, y:0}}
               initial={{ opacity: 0, y:100 }}
               transition={{ duration: 1 }}

             className='lg:text-xl py-5 text-sm sm:py-2 lg:ml-2  tracking-widest font-semibold flex items-center sm:justify-center lg:justify-normal'>
             Your Own Ship Route Navigator <span className='mt-1 ml-1 text-2xl text-slate-700'><BiSolidNavigation /></span>
            </motion.p>

            <motion.button 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 100 }}
              transition={{ duration: 2 }}
              onClick={scrollToVideo}
              className="py-6 px-7 flex justify-center items-center gap-2 text-center bg-cyan-500 hover:bg-sky-800 hover:text-white text-slate-800 md:w-96 w-full md:text-2xl text-2xl font-bold tracking-widest rounded-xl border-b-4 border-l-4"
            >
              Try Now <IoArrowForwardCircleSharp className='text-white text-3xl' />
            </motion.button>

           
           
            </div>
            <motion.div
              whileInView={{ opacity: 1, y:0}}
              initial={{ opacity: 0, y:100 }}
              transition={{ duration: 2 }}
            >
            <img src={MAP} alt="MAP" className='w-full max-w-lg rounded-xl' />
            </motion.div>
            </div>
        </div>

        <div>
            {/* Goals Section */}
            <div className="text-white  bg-[#181818] py-16 ">
                <div className="max-w-screen-xl  px-7 mx-auto">
                <motion.h2 
                          whileInView={{ opacity: 1, y: 0 }}
                          initial={{ opacity: 0, y: 100 }}
                          transition={{ duration: 1 }}
                          className="text-4xl font-bold mb-12 py-4 rounded-sm flex justify-center items-center"
                        >
                          <span className="flex items-center gap-2">
                            Our Goals <GiStairsGoal className='text-cyan-600' />
                          </span>
                        </motion.h2>

                    <motion.div
                     whileInView={{ opacity: 1, y:0}}
                     initial={{ opacity: 0, y:100 }}
                     transition={{ duration: 1.5 }}

                    className=" flex gap-5 flex-wrap sm:flex-nowrap ">
                        <div className="w-full  sm:w-1/3 bg-[#222] text-center rounded-lg p-8 cursor-pointer transition-transform duration-300 ease-in-out hover:bg-[#41a0e4] hover:scale-105">
                            <div className='sm:text-7xl text-3xl'>E</div>
                            <div className="text-2xl font-medium mb-3 mt-4">Engage</div>
                            <p>
                            Facilitate live interactions between commoners and ports, allowing real-time communication and engagement.
                             Our platform connects users with port activities, providing them with firsthand updates and insights
                            </p>
                        </div>
                        <div className="w-full sm:w-1/3 bg-[#222] text-center rounded-lg p-8 cursor-pointer transition-transform duration-300 ease-in-out hover:bg-[#41a0e4] hover:scale-105">
                        <div className=' sm:text-7xl text-3xl'>V</div>

                            <div className="text-2xl font-medium mb-3 mt-4">Visualize</div>
                            <p>
                            Provide comprehensive visualizations that showcase critical factors like weather conditions, traffic, and ship movements.
                             Our tools offer a clear, interactive view of maritime dynamics, making complex data accessible and understandable.
                            </p>
                        </div>
                        <div className="w-full sm:w-1/3 bg-[#222] text-center rounded-lg p-8 cursor-pointer transition-transform duration-300 ease-in-out hover:bg-[#41a0e4] hover:scale-105">
                    
                        <div className='sm:text-7xl text-3xl'>O</div>
                            <div className="text-2xl font-medium mb-3 mt-4">Optimize</div>
                            <p>
                            Deliver optimal route and speed recommendations, along with detailed distance calculations, through engaging animations. 
                            We aim to enhance decision-making for maritime operations by offering real-time, visually dynamic solutions.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Video Section */}
            <div ref={videoRef} className="relative w-full h-60 sm:h-full bg-slate-700 sm:px-4 sm:py-5">
    <div className="relative w-[95vw] h-[calc(95vw*9/16)] max-w-[1600px] sm:max-h-[calc(1600px*9/16)]  max-h-[calc(410px*9/16)] overflow-hidden mx-auto  cursor-pointer group">
        <video
            autoPlay
            muted
            loop
            className="w-full h-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-70"
        >
            <source src={NAVIER} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <div 
        className="absolute inset-0 flex items-center justify-center text-center text-white text-4xl font-bold opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 bg-black bg-opacity-50 tracking-widest">
            Welcome to Navier
        </div>
    </div>
</div>

        </div>

        



  <div className="min-h-screen">
            <div className='w-full bg-slate-700 justify-around py-4 px-4 lg:flex'>
                <div className='flex flex-wrap'>
                    <div>
                <h1 className='text-white text-2xl mb-2'>Search Location</h1>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="example:bhubaneswar"
                        className="p-2 border w-full lg:w-56"
                    />
                   </div>
                    <div className='space-x-4 py-10 px-2  '>
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-400 text-white rounded"
                        >
                            Search
                        </button>
                        <button
                            onClick={() => {
                                if (browserSupportsSpeechRecognition) {
                                    resetTranscript();
                                    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                                    const recognition = new SpeechRecognition();
                                    recognition.lang = 'en-US';
                                    recognition.onresult = (event) => {
                                        const result = event.results[0][0].transcript;
                                        setSearchQuery(result);
                                        handleSearch();
                                    };
                                    recognition.start();
                                } else {
                                    alert('Speech recognition not supported');
                                }
                            }}
                            className="p-2 bg-white rounded"
                        >
                            🎙️
                        </button>
                    </div>
                </div>
            
                <div >
                <div className='py-3 px-3 shadow-lg lg:mt-7 bg-gray-800 rounded-md '>
                <div className='flex space-x-2 '>
                    <button
                        onClick={() => setActiveView('default')}
                        className="block  px-4 py-2 bg-gray-700 text-white rounded"
                    >
                        Default View
                    </button>
                    <button
                        onClick={() => setActiveView('satellite')}
                        className="block  px-4 py-2 bg-gray-700 text-white rounded"
                    >
                        Satellite View
                    </button>
                    <button
                        onClick={() => setActiveView('ocean')}
                        className="block  px-4 py-2 bg-gray-700 text-white rounded"
                    >
                        Ocean View
                    </button>
                </div>
            </div>
                </div>

            </div>
           

 <div className="w-full h-screen block lg:px-12 lg:py-12 px-6 py-6 bg-slate-800">
  <div className="relative w-full h-full">
    <MapContainer center={mapCenter} zoom={5} className="w-full h-full">
      <TileLayer url={layers[activeView]} />
      {portsData.map((port, index) => (
        <Marker key={index} position={port.coords} icon={icon}>
          <Popup>
            <strong>{port.name}</strong>
            <br />
            District: {port.district}
            <br />
            State: {port.state}
            <br />
            Latitude: {port.coords[0]}
            <br />
            Longitude: {port.coords[1]}
            <br />
            Lococode: {port.lococode}
          </Popup>
        </Marker>
      ))}
      {searchLocation && (
        <Marker position={searchLocation} icon={icons}>
          <Popup>
            {searchQuery}
            <br />
            Latitude: {searchLocation[0]}
            <br />
            Longitude: {searchLocation[1]}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  </div>
</div>
   </div>

   <div id="teams" className="bg-gray-900 text-white py-20 px-4">
      <div className="max-w-screen-lg mx-auto text-center">
        <motion.h2 
         whileInView={{ opacity: 1, y:0}}
         initial={{ opacity: 0, y:100 }}
         transition={{ duration: 1 }}
        
        className="text-4xl font-bold mb-12"><span className='text-slate-400'>Meet</span> Our <span className='text-cyan-500'>Team</span></motion.h2>
        <motion.div
         whileInView={{ opacity: 1, y:0}}
         initial={{ opacity: 0, y:100 }}
         transition={{ duration: 1 }}

        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800 rounded-md hover:bg-slate-700 duration-700 border-slate-800  hover:border-cyan-500 border"
            >
              <div className="relative w-full aspect-w-4 aspect-h-3 mb-4">
                <img
                  src={member.imgs}
                  alt={member.name}
                  className="w-full h-96 object-cover rounded-md hover:scale-105 transition ease-in-out"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-sm">{member.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
        </div>
        </>
       
    );
};

export default Home;
