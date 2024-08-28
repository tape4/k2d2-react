import React, { useEffect, useRef } from "react";

const NaverMap = () => {
    const mapElement = useRef(null); // 지도를 표시할 DOM 요소를 참조합니다.

    useEffect(() => {
        const { naver } = window; // window 객체에서 naver를 가져옵니다.

        // 여의도의 중심 위치 설정
        const lat = 37.5219;
        const lng = 126.9245;
        const location = new naver.maps.LatLng(lat, lng);

        // 1. 지도 생성
        const map = new naver.maps.Map(mapElement.current, {
            center: location,
            zoom: 14, // 초기 확대/축소 레벨 설정
        });

        // 2. 기본 마커 추가
        new naver.maps.Marker({
            position: location,
            map: map,
        });

        // 3. GeoJSON 파일 불러오기 및 지도에 표시하기
        fetch("/result.geojson", { cache: "no-store" }) // GeoJSON 파일 경로 설정
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((geojson) => {
                console.log("GeoJSON data loaded:", geojson); // GeoJSON 데이터 로드 확인

                const bounds = new naver.maps.LatLngBounds(); // 지도 경계 초기화

                // GeoJSON 피처들을 순회하며 지도에 추가
                geojson.features.forEach((feature) => {
                    const { geometry } = feature;

                    if (geometry.type === "Polygon") {
                        // Polygon 처리
                        const polygonPath = geometry.coordinates[0].map(
                            (coord) => {
                                const latlng = new naver.maps.LatLng(
                                    coord[1], // 위도
                                    coord[0] // 경도
                                );
                                bounds.extend(latlng); // 경계 확장
                                return latlng;
                            }
                        );

                        if (polygonPath.length > 0) {
                            new naver.maps.Polygon({
                                paths: polygonPath,
                                map: map,
                                fillColor: "#FF0000",
                                fillOpacity: 0.5,
                                strokeColor: "#FF0000",
                                strokeOpacity: 1,
                                strokeWeight: 2,
                            });
                        }
                    } else if (geometry.type === "MultiPolygon") {
                        // MultiPolygon 처리
                        geometry.coordinates.forEach((polygonCoords) => {
                            polygonCoords.forEach((coords) => {
                                const multiPolygonPath = coords.map((coord) => {
                                    const latlng = new naver.maps.LatLng(
                                        coord[1], // 위도
                                        coord[0] // 경도
                                    );
                                    bounds.extend(latlng); // 경계 확장
                                    return latlng;
                                });

                                if (multiPolygonPath.length > 0) {
                                    new naver.maps.Polygon({
                                        paths: multiPolygonPath,
                                        map: map,
                                        fillColor: "#FF0000",
                                        fillOpacity: 0.5,
                                        strokeColor: "#FF0000",
                                        strokeOpacity: 1,
                                        strokeWeight: 2,
                                    });
                                }
                            });
                        });
                    } else {
                        console.log(
                            "Unsupported geometry type: ",
                            geometry.type
                        );
                    }
                });

                // 모든 피처를 포함하는 지도로 확대/축소
                if (bounds.hasLatLng(location)) {
                    map.setZoom(15); // 반경 5km에 해당하는 줌 레벨 설정
                    map.panToBounds(bounds); // 경계를 중심으로 지도 이동
                }
            })
            .catch((error) => console.error("Error loading GeoJSON:", error));
    }, []);

    return (
        <div>
            <div
                ref={mapElement}
                style={{ width: "100%", height: "500px" }}
            ></div>
        </div>
    );
};

export default NaverMap;
