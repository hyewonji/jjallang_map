import React, { useEffect, useState } from "react";
import Button from "./Button";

const { kakao } = window;

function KakaoMap() {
    const [coords, setCoords] = useState({
        latitude: 33.450701,
        longitude: 126.570667,
    });
    const [location, setLocation] = useState("");

    /* 현재 위치 받아오기 */
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((data) => {
            setCoords({
                ...coords,
                latitude: data.coords.latitude,
                longitude: data.coords.longitude,
            });
        });
    }, []);

    /* Kakao 지도 API 활용 */
    useEffect(() => {
        console.log(kakao);
        const container = document.getElementById("map");
        const options = {
            center: new kakao.maps.LatLng(coords.latitude, coords.longitude),
            level: 3,
        };
        const map = new kakao.maps.Map(container, options); // 지도 생성
        const ps = new kakao.maps.services.Places(); // 장소 검색 객체 생성
        const geocoder = new kakao.maps.services.Geocoder(); // 주소-좌표 변환 객체 생성
        const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 }); // 클릭한 위치에 대한 주소 표시

        searchAddrFromCoords(map.getCenter(), displayCenterInfo); //현재 지도 중심좌표 주소 표시
        ps.keywordSearch(`${location} 코인 노래방`, placesSearchCB); // 키워드로 장소 검색
        map.panBy(100, 50);

        kakao.maps.event.addListener(map, "dragend", function () {
            const center = map.getCenter();
            console.log(center.La, center.Ma);
            // setCoords({
            //     ...coords,
            //     latitude: center.La,
            //     longitude: center.Ma,
            // });
        });

        // 좌표로 행정동 주소 정보를 표시하는 함수
        function searchAddrFromCoords(coords, callback) {
            geocoder.coord2RegionCode(
                coords.getLng(),
                coords.getLat(),
                callback
            );
        }

        // 지도 중심좌표에 대한 주소정보 표시하는 함수
        function displayCenterInfo(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                const infoDiv = document.getElementById("centerAddr");
                for (var i = 0; i < result.length; i++) {
                    // 행정동의 region_type 값은 'H' 이므로
                    if (result[i].region_type === "H") {
                        infoDiv.innerHTML = result[i].address_name;
                        const address = result[i].address_name.split(" ");
                        setLocation(address[2]);
                        break;
                    }
                }
            }
        }

        // 키워드 검색 완료 시 호출되는 콜백함수
        function placesSearchCB(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
                var bounds = new kakao.maps.LatLngBounds();

                for (var i = 0; i < data.length; i++) {
                    displayMarker(data[i]);
                    bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                }
            }
        }

        // 지도에 마커 표시하는 함수
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
    }, [coords, location]);

    return (
        <>
            <div id="map" style={{ width: "100vw", height: "100vh" }} />
            <div
                className="hAddr"
                style={{
                    backgroundColor: "white",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 10,
                }}
            >
                <span className="title">지도중심기준 행정동 주소정보</span>
                <span id="centerAddr"></span>
                <Button>현 지도에서 재검색</Button>
            </div>
        </>
    );
}

export default KakaoMap;
