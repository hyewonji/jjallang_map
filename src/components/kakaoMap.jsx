/*global kakao*/

import React, { useEffect, useState } from "react";
// import styled from "styled-components";

function KakaoMap() {
    const [coords, setCoords] = useState({
        latitude: 33.450701,
        longitude: 126.570667,
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((data) => {
            setCoords({
                ...coords,
                latitude: data.coords.latitude,
                longitude: data.coords.longitude,
            });
        });
    }, []);

    useEffect(() => {
        console.log(coords);
        const container = document.getElementById("map");
        const options = {
            center: new kakao.maps.LatLng(coords.latitude, coords.longitude),
            level: 3,
        };
        const map = new kakao.maps.Map(container, options);
    }, [coords]);

    return <div id="map" style={{ width: "100vw", height: "100vh" }} />;
}

export default KakaoMap;
