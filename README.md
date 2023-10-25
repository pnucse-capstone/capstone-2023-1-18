
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

<img width="1200" alt="b" src="https://github.com/pnucse-capstone/Capstone-Template-2023/assets/83216580/1da760f1-bfd3-4866-9c4e-cbd0096b20f3">

<br/>

학습 데이터인 Stay Point와 GPS Data에서 결측치를 제거한 후 POI를 추출하여 DB에 저장, GPS Data를 HMM에 적용하기 적합한 포맷으로 변경한 후 HMM 모델 생성을 한다.

생성된 모델을 기반으로 User GPS를 학습데이터의 GPS Data 와 동일한 포맷으로 변경 후 모델에 적용해 Next Top 3 POI를 추출한다. 그리고 추출된 데이터와 실 경로를 비교하여 가시화하여 보여줌.

<br/>

### Visualization

<img width="1200" alt="a" src="https://github.com/pnucse-capstone/Capstone-Template-2023/assets/83216580/67a95597-3dab-4b21-a699-8899b99f9761">
<img width="1200" alt="b" src="https://github.com/pnucse-capstone/Capstone-Template-2023/assets/83216580/1da760f1-bfd3-4866-9c4e-cbd0096b20f3">

<br/>

위 그림은 User GPS 를 분석하여 Top3 POI 를 추천해주며 처음 Start Point에서 예측한 Top2 POI 지점으로 이동하는 실 경로를 보여준다.

<br/>

### Result

<img width="1200" alt="Screenshot 2023-10-25 at 9 02 40 PM" src="https://github.com/pnucse-capstone/Capstone-Template-2023/assets/83216580/a56fb287-d7d9-43bb-b34d-5bc73588466d">

<br/>

계절 구분없이 모델을 구성했을 때와 계절별로 모델을 따로 구성했을 때 정확도는 큰 차이가 없었다. 그 이유는 클러스터링 결과 POI가 계절에 따라 방문 여부나 빈도가 달라지는 것이 아니라, 계절에 관계없이 방문 빈도가 높은 관광지나 음식점으로 선정되었기 때문으로 사료된다. 또한 사용자의 관심 지점(POI)의 개수를 25개로 선정했을 때가 가장 예측 성능이 높았는데, 이는 클러스터의 개수가 적을 수록 하나의 클러스터 안에 포함된 GPS 정보의 개수가 많아지기 때문인 것으로 생각된다. 제주 데이터 허브에서 제공하는 데이터는 렌터카 운전자의 성별, 나이 등과 같은 정보는 공개되지 않아 사용할 수 있는 정보는 사용자의 로그 기록이 수집된 날짜 및 시간, 방문 장소의 위도 경도 데이터밖에 없었다. 따라서 사용자의 특성까지 고려하여 모델을 구성할 수 없었기에 여행객의 다음 방문 위치 예측에 사용하는 정보는 현재 방문 위치밖에 없다는 한계가 있다. 또한 본 시스템은 HMM이라는 확률 모델을 사용했기 때문에 몇몇 사용자의 다음 이동 예상 지점이 현재 위치와는 많이 떨어져 있는 경우가 있었다. 주어진 시간의 한계로 인하여 적용할 수는 없었으나, 앞서 서술한 바와 같은 경우 이를 보정해줄 수 있는 방안을 적용할 필요가 있다.

---

# 4. Demo

[![부산대학교 정보컴퓨터공학부 소개](http://img.youtube.com/vi/zh_gQ_lmLqE/0.jpg)](https://www.youtube.com/watch?v=zh_gQ_lmLqE)

---

# 5. Instruction

<br/>

### FMM - https://fmm-wiki.github.io
### mongoDB - Put data in mongoDB folder
