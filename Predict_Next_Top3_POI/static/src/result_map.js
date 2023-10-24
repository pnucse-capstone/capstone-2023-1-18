/**
 *   FMM web application
 *   Author: Can Yang
 */
var center = [33.36173, 126.5292];
var zoom_level = 10;
var restaurant_list = [];
var attraction_list = [];
var show_restaurant_list = [];
var marker_restaurant_list = [];
var show_attraction_list = [];
var marker_attraction_list = [];
var POI_marker;
var POI_list = [];
var Top1_marker;
var Top2_marker;
var Top3_marker;
const AttractionLayer = L.layerGroup();
const RestaurantLayer = L.layerGroup();
const PointLayer = L.layerGroup();
const Top1Layer = L.layerGroup();
const Top2Layer = L.layerGroup();
const Top3Layer = L.layerGroup();
var moving_marker = L.icon({
  iconUrl: "/static/asset/img/moving_marker.png",
  iconSize: [48, 48], // 마커의 가로, 세로 크기
});
map = new L.Map("map1", {
  center: new L.LatLng(center[0], center[1]),
  zoom: zoom_level,
  minZoom: 10,
});
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var exteriorStyle = {
  color: "#FF8C00",
  fill: false,
  opacity: 1.0,
  weight: 5,
  dashArray: "10 10",
};

var matched_result_layer;
var current_drawing_data;

var editableLayers = new L.FeatureGroup();
var editableLayers1 = new L.FeatureGroup();
var editableLayers2 = new L.FeatureGroup();
var editableLayers3 = new L.FeatureGroup();
map.addLayer(editableLayers);
map.addLayer(editableLayers1);
map.addLayer(editableLayers2);
map.addLayer(editableLayers3);

var options = {
  position: "topleft",
  draw: {
    polyline: false,
    polygon: false,
    circle: false,
    rectangle: false,
    marker: false,
  },
  edit: false,
};
var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (e) {
  var type = e.layerType,
    layer = e.layer;
  editableLayers.addLayer(layer);
  // Run map matching
  var traj = e.layer.toGeoJSON();
  var wkt = Terraformer.WKT.convert(traj.geometry);
  match_wkt(wkt);
});

var match_wkt = function (wkt) {
  $.getJSON("/match_wkt", {
    wkt: wkt,
  })
    .done(function (data) {
      if (data.state == 1) {
        var geojson = Terraformer.WKT.parse(data.wkt);
        var geojson_layer = L.geoJson(geojson, {
          style: function (feature) {
            return {
              color: "red",
              weight: 2.5,
              opacity: 0.5,
            };
          },
        });
        editableLayers.addLayer(geojson_layer);
        var circleIcon = L.icon({
          iconUrl:
            "data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-50 -50 100 100'><circle cx='0' cy='0' r='20' fill='black' /></svg>",
          iconSize: [40, 40],
        });
        var modifiedCoordinates = [];
        for (var i = 0; i < geojson.coordinates.length; i++) {
          var lat = geojson.coordinates[i][1];
          var lng = geojson.coordinates[i][0];
          modifiedCoordinates.push([lat, lng]);
        }
        var myMovingMarker1 = L.Marker.movingMarker(modifiedCoordinates, 2000, {
          autostart: false,
          icon: circleIcon,
        });
        editableLayers.addLayer(myMovingMarker1);
        myMovingMarker1.start();
      } else {
        alert("Cannot match the trajectory, try another one");
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      alert("Error with fetching data from server");
      console.log("error " + textStatus);
      console.log("incoming Text " + jqXHR.responseText);
    });
};
var actual_match_wkt = function (wkt) {
  $.getJSON("/match_wkt", {
    wkt: wkt,
  })
    .done(function (data) {
      if (data.state == 1) {
        var geojson = Terraformer.WKT.parse(data.wkt);
        var geojson_layer = L.geoJson(geojson, {
          style: function (feature) {
            return {
              color: "orange",
              weight: 5,
              opacity: 1,
            };
          },
        });
        editableLayers.addLayer(geojson_layer);
        var circleIcon = L.icon({
          iconUrl: "/static/asset/img/moving_marker.png",
          iconSize: [32, 32],
        });
        var modifiedCoordinates = [];
        for (var i = 0; i < geojson.coordinates.length; i++) {
          var lat = geojson.coordinates[i][1];
          var lng = geojson.coordinates[i][0];
          modifiedCoordinates.push([lat, lng]);
        }
        var myMovingMarker = L.Marker.movingMarker(modifiedCoordinates, 2000, {
          autostart: false,
          icon: circleIcon,
        });
        editableLayers.addLayer(myMovingMarker);
        myMovingMarker.start();
      } else {
        alert("Cannot match the trajectory, try another one");
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      alert("Error with fetching data from server");
      console.log("error " + textStatus);
      console.log("incoming Text " + jqXHR.responseText);
    });
};

map.on(L.Draw.Event.DRAWSTART, function (e) {
  editableLayers.clearLayers();
});

L.Control.RemoveAll = L.Control.extend({
  options: {
    position: "topleft",
  },
  onAdd: function (map) {
    var controlDiv = L.DomUtil.create(
      "div",
      "leaflet-control leaflet-bar leaflet-draw-toolbar"
    );
    var controlUI = L.DomUtil.create(
      "a",
      "leaflet-draw-edit-remove",
      controlDiv
    );
    controlUI.title = "Clean map";
    controlUI.setAttribute("href", "#");
    L.DomEvent.addListener(controlUI, "click", L.DomEvent.stopPropagation)
      .addListener(controlUI, "click", L.DomEvent.preventDefault)
      .addListener(controlUI, "click", function () {
        if (editableLayers.getLayers().length == 0) {
          alert("No features drawn");
        } else {
          editableLayers.clearLayers();
          $("#uv-div").empty();
        }
      });
    return controlDiv;
  },
});
removeAllControl = new L.Control.RemoveAll();
map.addControl(removeAllControl);

var add_listeners = function () {
  $("#zoom_center").click(function () {
    map.setView(center, zoom_level);
  });
  $("#clean_map").click(function () {
    editableLayers.clearLayers();
  });
};
add_listeners();

var wkt2geojson = function (data) {
  // Generate a MultiLineString
  var multilinestring_json = Terraformer.WKT.parse(data);
  var coordinates = multilinestring_json.coordinates;
  var result = {
    type: "FeatureCollection",
    features: [],
  };
  var arrayLength = coordinates.length;
  for (var i = 0; i < arrayLength; i++) {
    result.features.push({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: coordinates[i],
      },
    });
  }
  return result;
};

//
fetch("/get_Restaurant") // Flask 애플리케이션의 엔드포인트를 지정하세요.
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // data를 사용하여 데이터 처리
    restaurant_list = data;
  })
  .catch(function (error) {
    console.error("데이터 가져오기 실패:", error);
  });
fetch("/get_Attraction") // Flask 애플리케이션의 엔드포인트를 지정하세요.
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // data를 사용하여 데이터 처리
    attraction_list = data;
  })
  .catch(function (error) {
    console.error("데이터 가져오기 실패:", error);
  });

var storeIcon = L.icon({
  iconUrl: "/static/asset/img/store.png",
  iconSize: [48, 48], // 마커의 가로, 세로 크기
});
var attractionIcon = L.icon({
  iconUrl: "/static/asset/img/attraction.png",
  iconSize: [48, 48], // 마커의 가로, 세로 크기
});
var Top1Icon = L.icon({
  iconUrl: "/static/asset/img/top1_marker.png",
  iconSize: [48, 48], // 마커의 가로, 세로 크기
});
var Top2Icon = L.icon({
  iconUrl: "/static/asset/img/top2_marker.png",
  iconSize: [48, 48], // 마커의 가로, 세로 크기
});
var Top3Icon = L.icon({
  iconUrl: "/static/asset/img/top3_marker.png",
  iconSize: [48, 48], // 마커의 가로, 세로 크기
});
var StartIcon = L.icon({
  iconUrl: "/static/asset/img/start.png",
  iconSize: [48, 48], // 마커의 가로, 세로 크기
});

function restaurant_marking(point, text) {
  Restaurant_marker = L.marker(point, { icon: storeIcon })
    .bindPopup(text)
    .addTo(RestaurantLayer);
  map.addLayer(RestaurantLayer);
}
function attraction_marking(point, text) {
  Attraction_marker = L.marker(point, { icon: attractionIcon })
    .bindPopup(text)
    .addTo(AttractionLayer);
  map.addLayer(AttractionLayer);
}
//

var Start_Point = null;
var addStartButton = null;
var dawn_cnt = 0;
var morning_cnt = 0;
var afternoon_cnt = 0;
var evening_cnt = 0;
var PredictButton = document.getElementById("Predictbtn");
var resetButton = document.getElementById("Resetbtn");

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function haversine(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // 지구의 반지름 (단위: 킬로미터)

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c; // 거리 (단위: 킬로미터)

  return distance;
}

// 레스토랑 버튼을 클릭할 때 실행될 함수
document
  .getElementById("restaurant-button")
  .addEventListener("click", function () {
    // 목록을 초기화하고 레스토랑 목록을 추가
    var ol = document.querySelector(".large-numbers");
    ol.innerHTML = ""; // 목록 초기화

    // 레스토랑 목록 추가 예제
    for (var i = 0; i < show_restaurant_list.length; i++) {
      var li = document.createElement("li");
      var link = document.createElement("a");
      link.href = show_restaurant_list[i][0];
      link.target = "_blank"; // 새 창으로 열립니다.
      link.textContent = show_restaurant_list[i][1]; // 링크 텍스트를 설정하세요.

      // 링크를 목록 항목에 추가합니다.
      li.appendChild(link);

      // 나머지 내용을 추가합니다.
      li.innerHTML +=
        show_restaurant_list[i][2] +
        "(" +
        show_restaurant_list[i][3] +
        ")" +
        "<br>주소: " +
        show_restaurant_list[i][4];

      ol.appendChild(li);
    }
    for (var j = 0; j < marker_restaurant_list.length; j++) {
      restaurant_marking(marker_restaurant_list[j], "Restaurant - " + (j + 1));
    }
    AttractionLayer.clearLayers();
  });

// 어트랙션 버튼을 클릭할 때 실행될 함수
document
  .getElementById("attraction-button")
  .addEventListener("click", function () {
    // 목록을 초기화하고 어트랙션 목록을 추가
    var ol = document.querySelector(".large-numbers");
    ol.innerHTML = ""; // 목록 초기화
    // 어트랙션 목록 추가 예제
    for (var i = 0; i < show_attraction_list.length; i++) {
      var li = document.createElement("li");
      var link = document.createElement("a");
      link.href = show_attraction_list[i][0];
      link.target = "_blank"; // 새 창으로 열립니다.
      link.textContent = show_attraction_list[i][1]; // 링크 텍스트를 설정하세요.

      // 링크를 목록 항목에 추가합니다.
      li.appendChild(link);

      // 나머지 내용을 추가합니다.
      li.innerHTML +=
        show_attraction_list[i][2] +
        "(" +
        show_attraction_list[i][3] +
        ")" +
        "<br>주소: " +
        show_attraction_list[i][4];

      ol.appendChild(li);
      for (var j = 0; j < marker_attraction_list.length; j++) {
        attraction_marking(
          marker_attraction_list[j],
          "Attraction - " + (j + 1)
        );
      }
      RestaurantLayer.clearLayers();
    }
  });

var input_traj = [
  {
    start_point: "",
    end_point: "",
    path: [],
    time_period: [],
    l_sequence: [],
  },
  // 다른 데이터 항목 추가 가능
];

fetch("/get_Total_POI") // Flask 애플리케이션의 엔드포인트를 지정하세요.
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // data를 사용하여 데이터 처리
    POI_list = data;
  })
  .catch(function (error) {
    console.error("데이터 가져오기 실패:", error);
  });

function POI_mapping(xLat, xLon) {
  let closestIndex = -1;
  let closestDistance = Infinity;

  for (let i = 0; i < POI_list.length; i++) {
    const POI = POI_list[i];
    const distance = haversine(xLat, xLon, POI.latitude, POI.longitude);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }
  return closestIndex;
}
function labelSequence(path, timePeriod) {
  const lSequence = [];
  for (let idx = 0; idx < path.length; idx++) {
    const LID = parseInt(path[idx].replace("POI", ""));
    let T = 0;
    if (timePeriod[idx] === "dawn") {
      T = 0;
    } else if (timePeriod[idx] === "morning") {
      T = 1;
    } else if (timePeriod[idx] === "afternoon") {
      T = 2;
    } else if (timePeriod[idx] === "night") {
      T = 3;
    }
    lSequence.push(LID * 4 + T);
  }
  return lSequence;
}

function onMapClick(e) {
  // 클릭한 위치에서 마커를 생성하고 지도에 추가
  if (addStartButton) {
    L.marker(e.latlng, { icon: StartIcon })
      .bindPopup("Start")
      .addTo(PointLayer);
    map.addLayer(PointLayer);
    Start_Point = 1;
    addStartButton = 0;
    let start_POI = POI_mapping(e.latlng.lat, e.latlng.lng);
    input_traj[0].start_point = "POI" + start_POI;
    input_traj[0].end_point = "POI" + start_POI;
    input_traj[0].path.push("POI" + start_POI);
    input_traj[0].time_period.push("dawn");
    input_traj[0].l_sequence.push(
      labelSequence(input_traj[0].path, input_traj[0].time_period)
    );
    dawn_cnt++;
    console.log(input_traj);
  }
}
var addMarkerButton = document.getElementById("addStartPoint");
addMarkerButton.addEventListener("click", function () {
  if (Start_Point) {
    PointLayer.clearLayers();
    Start_Point = 0;
  }
  addStartButton = 1;
  map.on("click", onMapClick); // 클릭 이벤트 핸들러 등록
});

// predict 누르면 end point, path, l_sequence 다시 계산  time_period  새벽2 아침2 점심2 저녁2 유지.
var chk_btn = 0;
var top3_poi;
var top3_poi_array;
var marker_ck = 0;
// console.log(input_traj);
function map_matching(choose_poi) {
  if (dawn_cnt < 2) {
    input_traj[0].time_period.push("dawn");
    dawn_cnt++;
  } else if (morning_cnt < 2) {
    input_traj[0].time_period.push("morning");
    morning_cnt++;
  } else if (afternoon_cnt < 2) {
    input_traj[0].time_period.push("afternoon");
    afternoon_cnt++;
  } else if (evening_cnt < 2) {
    input_traj[0].time_period.push("evening");
    evening_cnt++;
  } else {
    alert("You Should take some rest");
    return;
  }
  input_traj[0].end_point = choose_poi;
  input_traj[0].path.push(choose_poi);
  input_traj[0].l_sequence.pop();
  input_traj[0].l_sequence.push(
    labelSequence(input_traj[0].path, input_traj[0].time_period)
  );

  var linestring_traj = "LINESTRING(";
  var idx_path_poi = [];
  for (var i = 0; i < input_traj[0].path.length; i++) {
    var numericValue = parseInt(input_traj[0].path[i].replace("POI", ""));
    idx_path_poi.push(numericValue);
  }
  // console.log(idx_path_poi);
  var k = 0;
  for (k = idx_path_poi.length - 2; k < idx_path_poi.length - 1; k++) {
    linestring_traj += `${POI_list[idx_path_poi[k]].longitude} ${
      POI_list[idx_path_poi[k]].latitude
    },`;
  }
  linestring_traj += `${POI_list[idx_path_poi[k]].longitude} ${
    POI_list[idx_path_poi[k]].latitude
  })`;

  for (var i = 0; i < restaurant_list.length; i++) {
    if (
      haversine(
        POI_list[idx_path_poi[idx_path_poi.length - 1]].latitude,
        POI_list[idx_path_poi[idx_path_poi.length - 1]].longitude,
        restaurant_list[i]["위도"],
        restaurant_list[i]["경도"]
      ) <= 5
    ) {
      show_restaurant_list.push([
        restaurant_list[i]["링크"],
        restaurant_list[i]["이름"],
        restaurant_list[i]["평균평점"],
        restaurant_list[i]["총 리뷰수"],
        restaurant_list[i]["주소"],
      ]);
      marker_restaurant_list.push([
        restaurant_list[i]["위도"],
        restaurant_list[i]["경도"],
      ]);
    }
  }
  for (var i = 0; i < attraction_list.length; i++) {
    if (
      haversine(
        POI_list[idx_path_poi[idx_path_poi.length - 1]].latitude,
        POI_list[idx_path_poi[idx_path_poi.length - 1]].longitude,
        attraction_list[i]["위도"],
        attraction_list[i]["경도"]
      ) <= 5
    ) {
      show_attraction_list.push([
        attraction_list[i]["링크"],
        attraction_list[i]["이름"],
        attraction_list[i]["평균평점"],
        attraction_list[i]["총 리뷰수"],
        attraction_list[i]["주소"],
      ]);
      marker_attraction_list.push([
        attraction_list[i]["위도"],
        attraction_list[i]["경도"],
      ]);
    }
  }
  actual_match_wkt(linestring_traj);
  AttractionLayer.clearLayers();
  RestaurantLayer.clearLayers();
  chk_btn++;

  // match_wkt();
}
$(document).ready(function () {
  $("#Predictbtn").click(function () {
    if (chk_btn != 0) {
      show_attraction_list = [];
      show_restaurant_list = [];
      marker_attraction_list = [];
      marker_restaurant_list = [];
      Top1Layer.clearLayers();
      Top2Layer.clearLayers();
      Top3Layer.clearLayers();
      PointLayer.clearLayers();
      AttractionLayer.clearLayers();
      RestaurantLayer.clearLayers();
      chk_btn = 0;
    }
    // 서버로 데이터를 POST 요청
    fetch("/process_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input_traj: input_traj }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // data를 사용하여 데이터 처리
        top3_poi = data.result;
        top3_poi_array = top3_poi.split(" ");
      })
      .then(function () {
        top1_idx = POI_list[parseInt(top3_poi_array[0].replace("POI", ""))];
        top2_idx = POI_list[parseInt(top3_poi_array[1].replace("POI", ""))];
        top3_idx = POI_list[parseInt(top3_poi_array[2].replace("POI", ""))];
        Top1_marker = L.marker([top1_idx.latitude, top1_idx.longitude], {
          icon: Top1Icon,
        }).addTo(Top1Layer);
        map.addLayer(Top1Layer);
        Top2_marker = L.marker([top2_idx.latitude, top2_idx.longitude], {
          icon: Top2Icon,
        }).addTo(Top2Layer);
        map.addLayer(Top2Layer);
        Top3_marker = L.marker([top3_idx.latitude, top3_idx.longitude], {
          icon: Top3Icon,
        }).addTo(Top3Layer);
        map.addLayer(Top3Layer);

        Top1_marker.on("click", function () {
          // 팝업 열기
          map_matching(top3_poi_array[0]);
          console.log(marker_ck);
          // 또는 원하는 동작을 수행
        });

        Top2_marker.on("click", function () {
          // 팝업 열기
          map_matching(top3_poi_array[1]);
          console.log(marker_ck);
          // 또는 원하는 동작을 수행
        });
        Top3_marker.on("click", function () {
          // 팝업 열기
          map_matching(top3_poi_array[2]);
          console.log(marker_ck);
          // 또는 원하는 동작을 수행
        });
      })
      .catch(function (error) {
        console.error("데이터 가져오기 실패:", error);
      });
  });
});

resetButton.addEventListener("click", function () {
  input_traj = [
    {
      start_point: "",
      end_point: "",
      path: [],
      time_period: [],
      l_sequence: [],
    },
    // 다른 데이터 항목 추가 가능
  ];
  dawn_cnt = 0;
  morning_cnt = 0;
  afternoon_cnt = 0;
  evening_cnt = 0;
  chk_btn = 0;
  show_attraction_list = [];
  show_attraction_list = [];
  marker_attraction_list = [];
  marker_restaurant_list = [];
  AttractionLayer.clearLayers();
  RestaurantLayer.clearLayers();
  PointLayer.clearLayers();
  editableLayers.clearLayers();
  editableLayers1.clearLayers();
  editableLayers2.clearLayers();
  editableLayers3.clearLayers();
  Top1Layer.clearLayers();
  Top2Layer.clearLayers();
  Top3Layer.clearLayers();
  traj_based_Top1_marker_layer.clearLayers();
  traj_based_Top2_marker_layer.clearLayers();
  traj_based_Top3_marker_layer.clearLayers();
  top1_correct = 0;
  top2_correct = 0;
  top3_correct = 0;
});

// 가시화를 위한 작업
var traj_based_Top1_marker;
var traj_based_Top2_marker;
var traj_based_Top3_marker;
var traj_based_Top1_marker_layer = L.layerGroup();
var traj_based_Top2_marker_layer = L.layerGroup();
var traj_based_Top3_marker_layer = L.layerGroup();
var db_traj_idx = 0;
var db_traj = [
  {
    // trajectory_id: "",
    start_point: "",
    end_point: "",
    path: [],
    time_period: [],
    l_sequence: [],
  },
  // 다른 데이터 항목 추가 가능
];
var new_db_traj_array = [
  {
    // trajectory_id: "",
    start_point: "",
    end_point: "",
    path: [],
    time_period: [],
    l_sequence: [],
  },
  // 다른 데이터 항목 추가 가능
];
var db_linestring_traj = "LINESTRING(";
var top1_linestring_traj = "LINESTRING(";
var top2_linestring_traj = "LINESTRING(";
var top3_linestring_traj = "LINESTRING(";
function init_db_traj() {
  fetch("/get_Total_Traj") // Flask 애플리케이션의 엔드포인트를 지정하세요.
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // data를 사용하여 데이터 처리
      new_db_traj_array = [
        {
          // trajectory_id: "",
          start_point: "",
          end_point: "",
          path: [],
          time_period: [],
          l_sequence: [],
        },
        // 다른 데이터 항목 추가 가능
      ];
      db_traj_idx = 0;
      db_traj = data;
      var randomData = data[Math.floor(Math.random() * data.length)];
      db_traj = randomData;
    })
    .then(function () {
      var str = db_traj.path;
      var str2 = db_traj.time_period;
      var arr = JSON.parse(str.replace(/'/g, '"'));
      var arr2 = JSON.parse(str2.replace(/'/g, '"'));
      db_traj.path = arr;
      db_traj.time_period = arr2;
      db_traj.l_sequence = labelSequence(db_traj.path, db_traj.time_period);
      // console.log(db_traj);
      // var str_id = db_traj.trajectory_id;
      var str_start_point = db_traj.start_point;

      for (var i = 0; i <= db_traj.path.length; i++) {
        var path1 = db_traj.path.slice(0, i);
        var time_period1 = db_traj.time_period.slice(0, i);
        var l_sequence1 = db_traj.l_sequence.slice(0, i);
        var str_end_point = db_traj.path.slice(i - 1, i);

        var temp_traj = [
          {
            // trajectory_id: str_id,
            start_point: str_start_point,
            end_point: str_end_point,
            path: path1,
            time_period: time_period1,
            l_sequence: l_sequence1,
          },
          // 다른 데이터 항목 추가 가능
        ];
        // console.log(temp_traj);
        new_db_traj_array.push(temp_traj);
      }
      new_db_traj_array.shift(); // 배열의 첫 번째 요소를 삭제
      new_db_traj_array.shift(); // 배열의 첫 번째 요소를 삭제
    })
    .catch(function (error) {
      console.error("데이터 가져오기 실패:", error);
    });
}
var top1_correct = 0;
var top2_correct = 0;
var top3_correct = 0;
// console.log(new_db_traj_array);
$(document).ready(function () {
  $("#db_predict").click(function () {
    if (db_traj_idx + 1 == new_db_traj_array.length) {
      alert("End");
      return;
    }
    if (db_traj_idx != 0) {
      if (
        top1_linestring_traj == db_linestring_traj &&
        top1_linestring_traj != "LINESTRING("
      ) {
        top1_correct++;
        alert(
          `Correct!!\nTOP 1 : ${top1_correct}\nTOP 2 : ${top2_correct}\nTOP 3 : ${top3_correct}`
        );
      } else if (
        top2_linestring_traj == db_linestring_traj &&
        top1_linestring_traj != "LINESTRING("
      ) {
        top2_correct++;
        alert(
          `Correct!!\nTOP 1 : ${top1_correct}\nTOP 2 : ${top2_correct}\nTOP 3 : ${top3_correct}`
        );
      } else if (
        top3_linestring_traj == db_linestring_traj &&
        top1_linestring_traj != "LINESTRING("
      ) {
        top3_correct++;
        alert(
          `Correct!!\nTOP 1 : ${top1_correct}\nTOP 2 : ${top2_correct}\nTOP 3 : ${top3_correct}`
        );
      }
      traj_based_Top1_marker_layer.clearLayers();
      traj_based_Top2_marker_layer.clearLayers();
      traj_based_Top3_marker_layer.clearLayers();
      editableLayers1.clearLayers();
      editableLayers2.clearLayers();
      editableLayers3.clearLayers();
    }
    // 서버로 데이터를 POST 요청
    fetch("/process_db_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        new_db_traj_array: new_db_traj_array[db_traj_idx],
      }),
    })
      .then(function (response) {
        console.log(new_db_traj_array[db_traj_idx]);
        return response.json();
      })
      .then(function (data) {
        // data를 사용하여 데이터 처리
        top3_poi = data.result;
        top3_poi_array = top3_poi.split(" ");
      })
      .then(function () {
        db_linestring_traj = "LINESTRING(";
        top1_linestring_traj = "LINESTRING(";
        top2_linestring_traj = "LINESTRING(";
        top3_linestring_traj = "LINESTRING(";
        L.marker(
          [
            POI_list[
              parseInt(
                new_db_traj_array[db_traj_idx][0].start_point.replace("POI", "")
              )
            ].latitude,
            POI_list[
              parseInt(
                new_db_traj_array[db_traj_idx][0].start_point.replace("POI", "")
              )
            ].longitude,
          ],
          { icon: StartIcon }
        )
          .bindPopup("Start")
          .addTo(PointLayer);
        map.addLayer(PointLayer);

        top1_idx = POI_list[parseInt(top3_poi_array[0].replace("POI", ""))];
        top2_idx = POI_list[parseInt(top3_poi_array[1].replace("POI", ""))];
        top3_idx = POI_list[parseInt(top3_poi_array[2].replace("POI", ""))];

        traj_based_Top1_marker = L.marker(
          [top1_idx.latitude, top1_idx.longitude],
          {
            icon: Top1Icon,
          }
        ).addTo(traj_based_Top1_marker_layer);
        map.addLayer(traj_based_Top1_marker_layer);
        traj_based_Top2_marker = L.marker(
          [top2_idx.latitude, top2_idx.longitude],
          {
            icon: Top2Icon,
          }
        ).addTo(traj_based_Top2_marker_layer);
        map.addLayer(traj_based_Top2_marker_layer);
        traj_based_Top3_marker = L.marker(
          [top3_idx.latitude, top3_idx.longitude],
          {
            icon: Top3Icon,
          }
        ).addTo(traj_based_Top3_marker_layer);
        map.addLayer(traj_based_Top3_marker_layer);
        var db_idx_path_poi = [];
        for (
          var i = 0;
          i < new_db_traj_array[db_traj_idx + 1][0].path.length;
          i++
        ) {
          var numericValue = parseInt(
            new_db_traj_array[db_traj_idx + 1][0].path[i].replace("POI", "")
          );
          db_idx_path_poi.push(numericValue);
        }

        for (
          var i = db_idx_path_poi.length - 2;
          i < db_idx_path_poi.length;
          i++
        ) {
          if (i == db_idx_path_poi.length - 1) {
            db_linestring_traj += `${POI_list[db_idx_path_poi[i]].longitude} ${
              POI_list[db_idx_path_poi[i]].latitude
            })`;
            top1_linestring_traj += `${
              POI_list[parseInt(top3_poi_array[0].replace("POI", ""))].longitude
            } ${
              POI_list[parseInt(top3_poi_array[0].replace("POI", ""))].latitude
            })`;

            top2_linestring_traj += `${top2_idx.longitude} ${top2_idx.latitude})`;
            top3_linestring_traj += `${top3_idx.longitude} ${top3_idx.latitude})`;
          } else {
            db_linestring_traj += `${POI_list[db_idx_path_poi[i]].longitude} ${
              POI_list[db_idx_path_poi[i]].latitude
            },`;
            top1_linestring_traj += `${
              POI_list[db_idx_path_poi[i]].longitude
            } ${POI_list[db_idx_path_poi[i]].latitude},`;
            top2_linestring_traj += `${
              POI_list[db_idx_path_poi[i]].longitude
            } ${POI_list[db_idx_path_poi[i]].latitude},`;
            top3_linestring_traj += `${
              POI_list[db_idx_path_poi[i]].longitude
            } ${POI_list[db_idx_path_poi[i]].latitude},`;
          }
        }
        db_traj_idx++;
      })
      .then(function () {
        top1_match_wkt(top1_linestring_traj);
        top2_match_wkt(top2_linestring_traj);
        top3_match_wkt(top3_linestring_traj);
      })
      .then(function () {
        setTimeout(function () {
          actual_match_wkt(db_linestring_traj);
        }, 1000);
      })
      .catch(function (error) {
        console.error("데이터 가져오기 실패:", error);
      });
  });
});
var top1_match_wkt = function (wkt) {
  $.getJSON("/match_wkt", {
    wkt: wkt,
  })
    .done(function (data) {
      if (data.state == 1) {
        var geojson = Terraformer.WKT.parse(data.wkt);
        var geojson_layer = L.geoJson(geojson, {
          style: function (feature) {
            return {
              color: "black",
              weight: 5,
              opacity: 0.5,
            };
          },
        });
        editableLayers1.addLayer(geojson_layer);
      } else {
        alert("Cannot match the trajectory, try another one");
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      alert("Error with fetching data from server");
      console.log("error " + textStatus);
      console.log("incoming Text " + jqXHR.responseText);
    });
};

var top2_match_wkt = function (wkt) {
  $.getJSON("/match_wkt", {
    wkt: wkt,
  })
    .done(function (data) {
      if (data.state == 1) {
        var geojson = Terraformer.WKT.parse(data.wkt);
        var geojson_layer = L.geoJson(geojson, {
          style: function (feature) {
            return {
              color: "black",
              weight: 5,
              opacity: 0.5,
            };
          },
        });
        editableLayers2.addLayer(geojson_layer);
      } else {
        alert("Cannot match the trajectory, try another one");
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      alert("Error with fetching data from server");
      console.log("error " + textStatus);
      console.log("incoming Text " + jqXHR.responseText);
    });
};
var top3_match_wkt = function (wkt) {
  $.getJSON("/match_wkt", {
    wkt: wkt,
  })
    .done(function (data) {
      if (data.state == 1) {
        var geojson = Terraformer.WKT.parse(data.wkt);
        var geojson_layer = L.geoJson(geojson, {
          style: function (feature) {
            return {
              color: "black",
              weight: 5,
              opacity: 0.5,
            };
          },
        });
        editableLayers3.addLayer(geojson_layer);
      } else {
        alert("Cannot match the trajectory, try another one");
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      alert("Error with fetching data from server");
      console.log("error " + textStatus);
      console.log("incoming Text " + jqXHR.responseText);
    });
};

window.addEventListener("load", init_db_traj);

document.getElementById("Resetbtn").addEventListener("click", init_db_traj);
