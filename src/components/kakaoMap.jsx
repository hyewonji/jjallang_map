/*global kakao*/

import React, { useEffect, useState } from "react";

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
        const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
        const container = document.getElementById("map");
        const options = {
            center: new kakao.maps.LatLng(coords.latitude, coords.longitude),
            level: 5,
        };
        const map = new kakao.maps.Map(container, options);
        const ps = new kakao.maps.services.Places();
        ps.keywordSearch("코인 노래방", placesSearchCB);

        function placesSearchCB(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
                var bounds = new kakao.maps.LatLngBounds();

                for (var i = 0; i < data.length; i++) {
                    displayMarker(data[i]);
                    bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                }
                map.setBounds(bounds);
            }
        }

        function displayMarker(place) {
            var marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(place.y, place.x),
            });

            kakao.maps.event.addListener(marker, "click", function () {
                infowindow.setContent(
                    '<div style="padding:5px;font-size:12px;">' +
                        place.place_name +
                        "</div>"
                );
                infowindow.open(map, marker);
            });
        }
    }, [coords]);

    return <div id="map" style={{ width: "100vw", height: "100vh" }} />;
}

export default KakaoMap;
