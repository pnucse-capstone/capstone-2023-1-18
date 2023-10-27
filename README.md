
# 1. Project Introduction

### 프로젝트 명 : HMM을 이용한 다음 POI 추천 및 경로 시각화

### 목적 : 사용자의 경로 데이터를 은닉 마코프 모델(HMM)을 이용하여 모델에 학습시킨 후 사용자가 이동할 것으로 예상되는 다음 지점을 추천한다

---

# 2. Team Introduction

### 이성무(Back-end Developer, rudnftjdan@gmail.com)
### 하연지(Back-end Developer, danna102712@gmail.com)
### 정재원(Front-end Developer, jaewon0957@gmail.com)

---

# 3. Diagram

![모델-최종](https://github.com/pnucse-capstone/capstone-2023-1-18/assets/83216580/8cc77f87-ec4b-4df0-ae9f-f5283ef990eb)

<br/>

+ ##### 제주 데이터 허브의 [월별 렌터카 체류 거점 위치 정보]와 [월별 렌터카 위치정보] 데이터를 이용한다. 체류거점위치정보 데이터의 경우 사용자가 20분 이상 머문 것으로 기록된 지점에 대한 데이터이며, [월별 렌터카 위치정보]는 30초 단위로 사용자의 로그를 수집한 데이터이다. 두 가지 데이터에서 결측치와 제주도를 벗어난 지점의 GPS 데이터는 삭제한다. [월별 렌터카 체류 거점 위치 정보]에서 관심 지점(POI)을 추출하고, [월별 렌터카 위치정보]를 [월별 렌터카 체류 거점 위치 정보]에서 추출한 POI를 이용하여 HMM에 적용하기 적합한 포맷으로 변경한 후 학습 데이터와 검증 데이터를 7:3의 비율로 나누고, 학습 데이터를 HMM 모델에 학습시킨다.

+ ##### 검증 데이터를 HMM 모델에 적용하여 Next Top 3 POI를 추출한다. 그리고 추출된 데이터와 실 경로를 비교하여 가시화하여 보여준다.

<br/>

### Visualization

<img width="1200" alt="a" src="https://github.com/pnucse-capstone/Capstone-Template-2023/assets/83216580/67a95597-3dab-4b21-a699-8899b99f9761">
<img width="1200" alt="b" src="https://github.com/pnucse-capstone/Capstone-Template-2023/assets/83216580/1da760f1-bfd3-4866-9c4e-cbd0096b20f3">

<br/>

+ ##### 검증 데이터 User GPS 를 분석하여 Top3 POI 를 추천해주며, 처음 Start Point에서 추천한 TOP3 POI 중 First POI로 이동하는 실 경로를 보여준다.

### Result

<img width="1200" alt="Screenshot 2023-10-25 at 9 02 40 PM" src="https://github.com/pnucse-capstone/Capstone-Template-2023/assets/83216580/a56fb287-d7d9-43bb-b34d-5bc73588466d">

<br/>

+ ##### 계절 구분없이 모델을 구성했을 때와 계절별로 모델을 따로 구성했을 때 정확도는 큰 차이가 없었다. 그 이유는 클러스터링 결과 POI가 계절에 따라 방문 여부나 빈도가 달라지는 것이 아니라, 계절에 관계없이 방문 빈도가 높은 관광지나 음식점으로 선정되었기 때문으로 사료된다. 또한 사용자의 POI의 개수를 25개로 선정했을 때가 가장 예측 성능이 높았는데, 이는 클러스터의 개수가 적을 수록 하나의 클러스터 안에 포함된 GPS 정보의 개수가 많아지기 때문인 것으로 생각된다. 제주 데이터 허브에서 제공하는 데이터는 렌터카 운전자의 성별, 나이 등과 같은 정보는 공개되지 않아 사용할 수 있는 정보는 사용자의 로그 기록이 수집된 날짜 및 시간, 방문 장소의 위도 경도 데이터밖에 없었다. 따라서 사용자의 특성까지 고려하여 모델을 구성할 수 없었기에 여행객의 다음 방문 위치 예측에 사용하는 정보는 현재 방문 위치밖에 없다는 한계가 있다. 또한 본 시스템은 HMM이라는 확률 모델을 사용했기 때문에 몇몇 사용자의 다음 이동 예상 지점이 현재 위치와는 많이 떨어져 있는 경우가 있었다. 주어진 시간의 한계로 인하여 적용할 수는 없었으나, 앞서 서술한 바와 같은 경우 이를 보정해줄 수 있는 방안을 적용할 필요가 있다.

---

# 4. Demo

[![부산대학교 정보컴퓨터공학부 소개](http://img.youtube.com/vi/zh_gQ_lmLqE/0.jpg)](https://www.youtube.com/watch?v=zh_gQ_lmLqE)

---

# 5. Instruction

### Library & DB

  - FMM - https://fmm-wiki.github.io
    - C++ Compiler supporting c++11 and OpenMP
    - CMake >=3.5: cross platform building tools
    - GDAL >= 2.2: IO with ESRI shapefile, Geometry data type
    - Boost Graph >= 1.54.0: routing algorithms used in UBODT Generator
    - Boost Geometry >= 1.54.0: Rtree, Geometry computation
    - Boost Serialization >= 1.54.0: Serialization of UBODT in binary format
    - Libosmium: a library for reading OpenStreetMap data. It requires expat and bz2.
    - swig: used for building Python bindings.
    - flask
    - tornado
  - pymongo
  - hmmlearn
  - MongoDB

## How to use it

- fmm 설치가 완료되었을 때 fmm을 입력하면 나와야 하는 터미널 화면
  
```
[info][fmm_app_config.cpp:49 ] Start reading FMM configuration from arguments
fmm argument lists:
--ubodt (required) <string>: Ubodt file name
--network (required) <string>: Network file name
--network_id (optional) <string>: Network id name (id)
--source (optional) <string>: Network source name (source)
--target (optional) <string>: Network target name (target)
--gps (required) <string>: GPS file name
--gps_id (optional) <string>: GPS id name (id)
--gps_x (optional) <string>: GPS x name (x)
--gps_y (optional) <string>: GPS y name (y)
--gps_timestamp (optional) <string>: GPS timestamp name (timestamp)
--gps_geom (optional) <string>: GPS geometry name (geom)
--gps_point (optional): if specified read input data as gps point, otherwise (default) read input data as trajectory
--output (required) <string>: Output file name
--output_fields (optional) <string>: Output fields
  opath,cpath,tpath,mgeom,pgeom,
  offset,error,spdist,tp,ep,length,duration,speed,all
-k/--candidates (optional) <int>: Number of candidates (8)
-r/--radius (optional) <double>: search radius (network data unit) (300)
-e/--error (optional) <double>: GPS error (network data unit) (50)
--reverse_tolerance (optional) <double>: proportion of reverse movement allowed on an edge
-l/--log_level (optional) <int>: log level (2)
-s/--step (optional) <int>: progress report step (100)
--use_omp: use OpenMP for multithreaded map matching
-h/--help:print help information
For xml configuration, check example folder
```

- 웹 서비스 실행 방법
 
```
 ~/De/U/Department_/2023_1/G/Fr/web_demo  python web_demo.py -c stmatch_config.json
[2023-10-27 16:23:14.793] [info] [network.cpp:72] Read network from file data/edges.shp
[2023-10-27 16:23:14.977] [info] [network.cpp:170] Number of edges 57483 nodes 20812
[2023-10-27 16:23:14.977] [info] [network.cpp:172] Field index: id 17 source 0 target 1
[2023-10-27 16:23:14.996] [info] [network.cpp:174] Read network done.
[2023-10-27 16:23:14.996] [info] [network_graph.cpp:17] Construct graph from network edges start
[2023-10-27 16:23:14.998] [info] [network_graph.cpp:30] Graph nodes 20812 edges 57483
[2023-10-27 16:23:14.998] [info] [network_graph.cpp:31] Construct graph from network edges end
Tornado server starting on port 5001
Visit http://localhost:5001 to check the demo
```
