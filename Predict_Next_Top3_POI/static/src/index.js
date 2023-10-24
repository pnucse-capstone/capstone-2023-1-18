// home
let pixelRatio = 2;
var picture1 = document.getElementById("swiper-image-1");
var picture2 = document.getElementById("swiper-image-2");
var picture3 = document.getElementById("swiper-image-3");
var picture4 = document.getElementById("swiper-image-4");
var picture5 = document.getElementById("swiper-image-5");
var picture6 = document.getElementById("swiper-image-6");
var picture7 = document.getElementById("swiper-image-7");
var picture8 = document.getElementById("swiper-image-8");
picture1.onclick = function () {
  drawing_font_image("Someori\nOreum", "1.svg");
};
picture2.onclick = function () {
  drawing_font_image("Stone\nWall", "2.svg");
};
picture3.onclick = function () {
  drawing_font_image("Seongsan\nSunrise Peak", "3.svg");
};
picture4.onclick = function () {
  drawing_font_image("Samyang\nSky Park", "4.svg");
};
picture5.onclick = function () {
  drawing_font_image("Woljeongri\nBeach", "5.svg");
};
picture6.onclick = function () {
  drawing_font_image("Jeju\nhorse", "6.svg");
};
picture7.onclick = function () {
  drawing_font_image("Cheonjiyeon\nWaterfall", "7.svg");
};
picture8.onclick = function () {
  drawing_font_image("Mountain\nHanlla", "8.svg");
};
const img_drawing = document.getElementById("home_main");
let ctx = img_drawing.getContext("2d");
img_drawing.width = document.body.clientWidth * pixelRatio;
img_drawing.height = document.body.clientHeight * pixelRatio;
img_drawing.style.width = document.body.clientWidth / 1.15 + "px";
img_drawing.style.height = document.body.clientHeight / 1.15 + "px";

ctx.scale(pixelRatio, pixelRatio);

const leon_canvas = document.getElementById("home_word");
let ctx_word = leon_canvas.getContext("2d");
leon_canvas.width = document.body.clientWidth * pixelRatio;
leon_canvas.height = document.body.clientHeight * pixelRatio;
leon_canvas.style.width = document.body.clientWidth + "px";
leon_canvas.style.height = document.body.clientHeight + "px";
ctx_word.scale(pixelRatio, pixelRatio);

const leon_title = document.getElementById("home_title");
let ctx_title = leon_title.getContext("2d");
leon_title.width = document.body.clientWidth * pixelRatio;
leon_title.height = document.body.clientHeight * pixelRatio;
leon_title.style.width = document.body.clientWidth + "px";
leon_title.style.height = document.body.clientHeight + "px";
ctx_title.scale(pixelRatio, pixelRatio);

function leon2() {
  leon2_title = new LeonSans({
    text: "Trajectory Prediction\nWith Hidden Markov Model\nSansooni & Jeongduli",
    color: ["#ff9900"],
    size: 60,
    weight: 800,
    align: "right",
  });
  let i,
    total = leon2_title.drawing.length;
  for (i = 0; i < total; i++) {
    TweenMax.fromTo(
      leon2_title.drawing[i],
      1.6,
      {
        value: 0,
      },
      {
        delay: i * 0.05,
        value: 1,
        ease: Power4.easeOut,
      }
    );
  }
  requestAnimationFrame(animate);
}

function animate(t) {
  requestAnimationFrame(animate);
  ctx_title.clearRect(
    0,
    0,
    document.body.clientWidth,
    document.body.clientHeight
  );
  const x = (document.body.clientWidth - leon2_title.rect.w) / 2;
  const y = (document.body.clientHeight - leon2_title.rect.h) / 2;
  leon2_title.position(x * 1.95, y * 1.95);

  leon2_title.draw(ctx_title);
}

leon2();
function drawing_font_image(file_name, svgFileName) {
  let circleIndex = 0; // 현재 찍을 <circle> 요소의 인덱스
  ctx.clearRect(0, 0, document.body.clientWidth, document.body.clientHeight);

  fetch("../static/asset/img/" + svgFileName)
    .then((response) => response.text())
    .then((svgData) => {
      // SVG 데이터를 DOM으로 파싱

      const parser = new DOMParser();
      const svgDOM = parser.parseFromString(svgData, "image/svg+xml");

      // <circle> 요소들 선택
      const circles = svgDOM.getElementsByTagName("circle");
      const circleInfoArray = [];
      for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        const cx = parseFloat(circle.getAttribute("cx"));
        const cy = parseFloat(circle.getAttribute("cy"));
        const r = parseFloat(circle.getAttribute("r"));
        const fill = circle.getAttribute("fill");

        const circleInfo = { cx, cy, r, fill };
        circleInfoArray.push(circleInfo);
      }

      // 배열을 랜덤하게 섞는 함수
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }

      // 배열을 랜덤하게 섞기
      shuffleArray(circleInfoArray);

      // 애니메이션 실행 함수
      function animateCircleGroup() {
        const circleGroupSize = 300; // 10개씩 그룹화
        const groupEndIndex = Math.min(
          circleIndex + circleGroupSize,
          circles.length
        );

        for (let i = circleIndex; i < groupEndIndex; i++) {
          const circleInfo = circleInfoArray[i];
          const { cx, cy, r, fill } = circleInfo;

          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fillStyle = fill;
          ctx.fill();
        }

        circleIndex = groupEndIndex; // 그룹에 속하는 circle들을 그린 후 인덱스 업데이트

        // 다음 프레임에 애니메이션 실행 요청
        if (circleIndex < circles.length) {
          requestAnimationFrame(animateCircleGroup);
        }
      }

      // 첫 번째 프레임에 애니메이션 실행 요청
      requestAnimationFrame(animateCircleGroup);
    })
    .catch((error) => console.error("오류 발생:", error));

  function leon() {
    leon = new LeonSans({
      text: file_name,
      color: ["#ff9900"],
      size: 100,
      weight: 800,
      align: "left",
    });
    let i,
      total = leon.drawing.length;
    for (i = 0; i < total; i++) {
      TweenMax.fromTo(
        leon.drawing[i],
        1.6,
        {
          value: 0,
        },
        {
          delay: i * 0.05,
          value: 1,
          ease: Power4.easeOut,
        }
      );
    }
    requestAnimationFrame(animate);
  }

  function animate(t) {
    requestAnimationFrame(animate);
    ctx_word.clearRect(
      0,
      0,
      document.body.clientWidth,
      document.body.clientHeight
    );
    const x = (document.body.clientWidth - leon.rect.w) / 2;
    const y = (document.body.clientHeight - leon.rect.h) / 2;
    leon.position(x / 2.4, y / 10);

    leon.draw(ctx_word);
  }

  setTimeout(() => {
    leon();
  }, 2000);
}

// Modal Code
// Data Collect

var img = document.getElementById("dc_img");

img.addEventListener("click", function () {
  var linkUrl = "https://www.jejudatahub.net";

  window.open(linkUrl, "_blank");
});

// modal data processing
const radio1 = document.getElementById("radio-1");
const radio2 = document.getElementById("radio-2");
const container = document.querySelector(".data-word");
const table_trajectory = document.querySelector(".traj-container");
const table_poi = document.querySelector(".poi-container");
const trajbtn = document.getElementById("trajbtn");
const poibtn = document.getElementById("poibtn");
const trajrow = document.querySelectorAll(".traj-content");
const tableRows = document.querySelectorAll("tbody tr");

radio1.addEventListener("click", () => {
  container.style.transform = "translateX(90%)";
  table_trajectory.classList.add("show-table");
  table_trajectory.classList.remove("remove-table");
  trajbtn.style.opacity = "1";
  trajbtn.style.display = "block";
  table_poi.classList.add("remove-table");
  table_poi.classList.remove("show-table");
  poibtn.style.opacity = "0";
  poibtn.style.display = "none";
});

radio2.addEventListener("click", () => {
  container.style.transform = "translateX(90%)";
  table_poi.classList.add("show-table");
  table_poi.classList.remove("remove-table");
  trajbtn.style.opacity = "0";
  trajbtn.style.display = "none";
  table_trajectory.classList.add("remove-table");
  table_trajectory.classList.remove("show-table");
  poibtn.style.opacity = "1";
  poibtn.style.display = "block";
});

$(document).ready(function () {
  const updateButton1 = $("#radio-1");
  const updateButton2 = $("#radio-2");
  const targetParagraph = $("#explain");

  updateButton1.click(function () {
    const newText = `<br/><strong>1. Remov Outlier</strong><br/><br/><strong>2. Transform Timedata</strong>`;
    targetParagraph.fadeOut(400, function () {
      targetParagraph.html(newText).fadeIn(400);
    });
  });
  updateButton2.click(function () {
    const newText = `<br/><strong>1. Remov Outlier</strong><br/><br/>
      <strong>2. Clustering to 25 using K-means++</strong>`;
    targetParagraph.fadeOut(400, function () {
      targetParagraph.html(newText).fadeIn(400);
    });
  });
});

// 체류위치정보 데이터
spot_html = `oid,collection_dt,longitude,latitude,time,Diff
46100025,20210703110730,126.925757,33.433039,2021-07-03 11:07:30,9713
46100025,20210703141800,126.922393,33.436265,2021-07-03 14:18:00,1611
46100025,20210703170200,126.787259,33.399146,2021-07-03 17:02:00,2662
46100025,20210703183400,146.419657,33.432382,2021-07-03 18:34:00,1500
46100025,20210703191800,126.488782,33.483767,2021-07-03 19:18:00,8479
46100025,20210703220000,126.419678,33.432403,2021-07-03 22:00:00,565239
46100025,20210710111230,126.258631,37.405052,2021-07-10 11:12:30,4529
46100025,20210710132630,126.24432,33.398631,2021-07-10 13:26:30,5379
`;

spot_upper_HTML = `oid,collection_dt,longitude,latitude,time,Diff
46100025,20210703110730,126.925757,33.433039,2021-07-03 11:07:30,9713
46100025,20210703141800,126.922393,33.436265,2021-07-03 14:18:00,1611
46100025,20210703170200,126.787259,33.399146,2021-07-03 17:02:00,2662
46100025,20210703191800,126.488782,33.483767,2021-07-03 19:18:00,8479
46100025,20210703220000,126.419678,33.432403,2021-07-03 22:00:00,565239
46100025,20210710132630,126.24432,33.398631,2021-07-10 13:26:30,5379
`;

clustering_HTML = `longitude,latitude
126.71063192820095,33.29221653467845
126.38151798312721,33.473653879077546
126.92659937356548,33.47555051897852
126.53139312908033,33.50733279587328
126.41912935957909,33.25160087484181
126.24648294773014,33.39513913354968
126.5643314518244,33.248971699833575
126.68062402184079,33.43878820175561
126.28711828512023,33.229897824166166
126.4554103442589,33.48650967338272
126.6668085876241,33.53837716347233
126.84342504106567,33.51652606105664
126.82878827740142,33.33269976269821
126.36231493609843,33.27161977022235
126.91401960097565,33.43566823339628
126.37245279666108,33.37870874856105
126.62122470499862,33.274760654861495
126.50688377638889,33.25212952483913
126.49245926815387,33.497591859652765
126.18608039830339,33.32403653948769
126.31171417714032,33.455354176916245
126.7720810475026,33.55072973956573
126.30081640995712,33.312085535926585
126.60466309287936,33.449538735176866
126.77060930352083,33.42855298731644`;

let poiTableContainer = document.getElementById("poi-table-container");

let rows = spot_html.trim().split("\n");
let headers = rows[0].split(",");

// Clear previous table content
poiTableContainer.querySelector("thead").innerHTML = "";
poiTableContainer.querySelector("tbody").innerHTML = "";

// Add table headers
headerRow = document.createElement("tr");
for (let header of headers) {
  let th = document.createElement("th");
  th.textContent = header;
  headerRow.appendChild(th);
}
poiTableContainer.querySelector("thead").appendChild(headerRow);

// Add table data
for (let i = 1; i < rows.length; i++) {
  let data = rows[i].split(",");
  let rowElement = document.createElement("tr");

  for (let value of data) {
    let columnElement = document.createElement("td");
    columnElement.textContent = value;
    rowElement.appendChild(columnElement);
  }

  poiTableContainer.querySelector("tbody").appendChild(rowElement);
}

poibtn.addEventListener("click", () => {
  let thead = poiTableContainer.querySelector("thead");
  let tbody = poiTableContainer.querySelector("tbody");
  if (poiTableContainer) {
    if (thead && tbody) {
      thead.classList.add("fade-out");
      tbody.classList.add("fade-out");
    }
  }
  setTimeout(() => {
    rows = spot_upper_HTML.trim().split("\n");
    console.log(rows);
    headers = rows[0].split(",");

    // Clear previous table content
    poiTableContainer.querySelector("thead").innerHTML = "";
    poiTableContainer.querySelector("tbody").innerHTML = "";

    // Add table headers
    headerRow = document.createElement("tr");
    for (let header of headers) {
      let th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    }
    poiTableContainer.querySelector("thead").appendChild(headerRow);

    // Add table data
    for (let i = 1; i < rows.length; i++) {
      let data = rows[i].split(",");
      let rowElement = document.createElement("tr");

      for (let value of data) {
        let columnElement = document.createElement("td");
        columnElement.textContent = value;
        rowElement.appendChild(columnElement);
      }

      poiTableContainer.querySelector("tbody").appendChild(rowElement);
    }
    if (thead && tbody) {
      thead.classList.remove("fade-out");
      tbody.classList.remove("fade-out");
      thead.classList.add("fade-in");
      tbody.classList.add("fade-in");
    }
  }, 1000);
  setTimeout(() => {
    if (poiTableContainer) {
      if (thead && tbody) {
        thead.classList.remove("fade-in");
        tbody.classList.remove("fade-in");
        thead.classList.add("fade-out");
        tbody.classList.add("fade-out");
      }
    }
  }, 4000);
  setTimeout(() => {
    rows = clustering_HTML.trim().split("\n");
    headers = rows[0].split(",");

    // Clear previous table content
    poiTableContainer.querySelector("thead").innerHTML = "";
    poiTableContainer.querySelector("tbody").innerHTML = "";

    // Add table headers
    headerRow = document.createElement("tr");
    for (let header of headers) {
      let th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    }
    poiTableContainer.querySelector("thead").appendChild(headerRow);

    // Add table data
    for (let i = 1; i < 13; i++) {
      let data = rows[i].split(",");
      let rowElement = document.createElement("tr");

      for (let value of data) {
        let columnElement = document.createElement("td");
        columnElement.textContent = value;
        rowElement.appendChild(columnElement);
      }

      poiTableContainer.querySelector("tbody").appendChild(rowElement);
    }
    if (thead && tbody) {
      thead.classList.remove("fade-out");
      tbody.classList.remove("fade-out");
      thead.classList.add("fade-in");
      tbody.classList.add("fade-in");
    }
  }, 5000);
});
traj_first_HTML = `oid,collection_dt,longitude,latitude
46100ff1,20210925124700986,126.589292,33.515323
461012fc,20210925124700986,180,90
4610181b,20210925124700986,126.506469,33.249598
461000e4,20210925124701143,126.345313,33.318585
461000ec,20210925124701143,126.429172,33.239188
461000f6,20210925124701268,126.480649,33.486621
46100441,20210925124701283,126.337268,33.40518
461012cf,20210925124701283,180,90
46100366,20210925124701362,126.666308,33.429266
46100283,20210925124701377,180,90
461002d8,20210925124701377,126.311104,33.462445
46101369,20210925124701580,126.455517,33.49334`;
traj_delete_HTML = `oid,collection_dt,longitude,latitude
46100ff1,20210925124700986,126.589292,33.515323
4610181b,20210925124700986,126.506469,33.249598
461000e4,20210925124701143,126.345313,33.318585
461000ec,20210925124701143,126.429172,33.239188
461000f6,20210925124701268,126.480649,33.486621
46100441,20210925124701283,126.337268,33.40518
46100366,20210925124701362,126.666308,33.429266
461002d8,20210925124701377,126.311104,33.462445
46101369,20210925124701580,126.455517,33.49334`;
traj_trans_HTML = `oid,collection_dt,longitude,latitude
46100ff1,2021-09-25-12:47:00,126.589292,33.515323
4610181b,2021-09-25-12:47:00,126.506469,33.249598
461000e4,2021-09-25-12:47:01,126.345313,33.318585
461000ec,2021-09-25-12:47:01,126.429172,33.239188
461000f6,2021-09-25-12:47:01,126.480649,33.486621
46100441,2021-09-25-12:47:01,126.337268,33.40518
46100366,2021-09-25-12:47:01,126.666308,33.429266
461002d8,2021-09-25-12:47:01,126.311104,33.462445
46101369,2021-09-25-12:47:01,126.455517,33.49334`;

let traj_table = document.getElementById("traj-talbe-container");

rows = traj_first_HTML.trim().split("\n");
headers = rows[0].split(",");

// Clear previous table content
traj_table.querySelector("thead").innerHTML = "";
traj_table.querySelector("tbody").innerHTML = "";

// Add table headers
headerRow = document.createElement("tr");
for (let header of headers) {
  let th = document.createElement("th");
  th.textContent = header;
  headerRow.appendChild(th);
}
traj_table.querySelector("thead").appendChild(headerRow);

// Add table data
for (let i = 1; i < rows.length; i++) {
  let data = rows[i].split(",");
  let rowElement = document.createElement("tr");

  for (let value of data) {
    let columnElement = document.createElement("td");
    columnElement.textContent = value;
    rowElement.appendChild(columnElement);
  }

  traj_table.querySelector("tbody").appendChild(rowElement);
}

trajbtn.addEventListener("click", () => {
  let thead = traj_table.querySelector("thead");
  let tbody = traj_table.querySelector("tbody");
  if (traj_table) {
    if (thead && tbody) {
      thead.classList.add("fade-out");
      tbody.classList.add("fade-out");
    }
  }
  setTimeout(() => {
    rows = traj_delete_HTML.trim().split("\n");
    headers = rows[0].split(",");

    // Clear previous table content
    traj_table.querySelector("thead").innerHTML = "";
    traj_table.querySelector("tbody").innerHTML = "";

    // Add table headers
    headerRow = document.createElement("tr");
    for (let header of headers) {
      let th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    }
    traj_table.querySelector("thead").appendChild(headerRow);

    // Add table data
    for (let i = 1; i < rows.length; i++) {
      let data = rows[i].split(",");
      let rowElement = document.createElement("tr");

      for (let value of data) {
        let columnElement = document.createElement("td");
        columnElement.textContent = value;
        rowElement.appendChild(columnElement);
      }

      traj_table.querySelector("tbody").appendChild(rowElement);
    }
    if (thead && tbody) {
      thead.classList.remove("fade-out");
      tbody.classList.remove("fade-out");
      thead.classList.add("fade-in");
      tbody.classList.add("fade-in");
    }
  }, 1000);
  setTimeout(() => {
    if (traj_table) {
      if (thead && tbody) {
        thead.classList.remove("fade-in");
        tbody.classList.remove("fade-in");
        thead.classList.add("fade-out");
        tbody.classList.add("fade-out");
      }
    }
  }, 4000);
  setTimeout(() => {
    rows = traj_trans_HTML.trim().split("\n");
    headers = rows[0].split(",");

    // Clear previous table content
    traj_table.querySelector("thead").innerHTML = "";
    traj_table.querySelector("tbody").innerHTML = "";

    // Add table headers
    headerRow = document.createElement("tr");
    for (let header of headers) {
      let th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    }
    traj_table.querySelector("thead").appendChild(headerRow);

    // Add table data
    for (let i = 1; i < rows.length; i++) {
      let data = rows[i].split(",");
      let rowElement = document.createElement("tr");

      for (let value of data) {
        let columnElement = document.createElement("td");
        columnElement.textContent = value;
        rowElement.appendChild(columnElement);
      }

      traj_table.querySelector("tbody").appendChild(rowElement);
    }
    if (thead && tbody) {
      thead.classList.remove("fade-out");
      tbody.classList.remove("fade-out");
      thead.classList.add("fade-in");
      tbody.classList.add("fade-in");
    }
  }, 5000);
});

$(function () {
  $(".image-container").slick({
    slide: "img", //슬라이드 되어야 할 태그 ex) div, li
    infinite: true, //무한 반복 옵션
    slidesToShow: 4, // 한 화면에 보여질 컨텐츠 개수
    slidesToScroll: 4, //스크롤 한번에 움직일 컨텐츠 개수
    speed: 500, // 다음 버튼 누르고 다음 화면 뜨는데까지 걸리는 시간(ms)
    dots: true, // 스크롤바 아래 점으로 페이지네이션 여부
    vertical: false, // 세로 방향 슬라이드 옵션
    draggable: true, //드래그 가능 여부
  });
});

//  final data
final_data_HTML = `trajectory_id,start_point,end_point,path,time_period
"(2020, 9, 5, '4610004e')"/POI2/POI0/"['POI2', 'POI8', 'POI13', 'POI8', 'POI0']"/"['morning', 'morning', 'morning', 'morning', 'morning']"
"(2020, 9, 5, '46100093')"/POI19/POI10/"['POI19', 'POI3', 'POI16', 'POI15', 'POI10', 'POI15', 'POI10']"/"['afternoon', 'afternoon', 'afternoon', 'afternoon', 'afternoon', 'afternoon', 'afternoon']"
"(2020, 9, 5, '46100095')"/POI18/POI1/"['POI18', 'POI1']"/"['dawn', 'dawn']"
"(2020, 9, 5, '4610009f')"/POI13/POI13/"['POI13', 'POI13', 'POI18', 'POI1', 'POI18', 'POI13']"/"['morning', 'afternoon', 'afternoon', 'afternoon', 'afternoon', 'afternoon']"
"(2020, 9, 5, '461000b5')"/POI19/POI13/"['POI19', 'POI3', 'POI5', 'POI3', 'POI19', 'POI13']"/"['afternoon', 'afternoon', 'afternoon', 'afternoon', 'afternoon', 'afternoon']"
"(2020, 9, 5, '461000b6')"/POI1/POI13/"['POI1', 'POI13']"/"['morning', 'morning']"
"(2020, 9, 5, '461000b7')"/POI5/POI5/"['POI5', 'POI3', 'POI5']"/"['afternoon', 'afternoon', 'afternoon']"
"(2020, 9, 5, '461000b9')"/POI5/POI0/"['POI5', 'POI0']"/"['morning', 'morning']"
"(2020, 9, 5, '461000bd')"/POI13/POI3/"['POI13', 'POI19', 'POI5', 'POI3', 'POI17', 'POI15', 'POI3', 'POI5', 'POI3']"/"['morning', 'morning', 'morning', 'morning', 'morning', 'morning', 'morning', 'morning', 'morning']"
"(2020, 9, 5, '461000c1')"/POI11/POI3/"['POI11', 'POI12', 'POI5', 'POI3']"/"['morning', 'morning', 'morning', 'morning']"
"(2020, 9, 5, '461000c3')"/POI13/POI7/"['POI13', 'POI13', 'POI8', 'POI13', 'POI10', 'POI7']"/"['morning', 'afternoon', 'afternoon', 'afternoon', 'afternoon', 'afternoon']"
"(2020, 9, 5, '461000c7')"/POI10/POI8/"['POI10', 'POI1', 'POI18', 'POI8', 'POI13', 'POI13', 'POI8']"/"['morning', 'morning', 'morning', 'morning', 'morning', 'afternoon', 'afternoon']"`;

let final_table = document.getElementById("final-table-container");

rows = final_data_HTML.trim().split("\n");
headers = rows[0].split(",");

// Clear previous table content
final_table.querySelector("thead").innerHTML = "";
final_table.querySelector("tbody").innerHTML = "";

// Add table headers
headerRow = document.createElement("tr");
for (let header of headers) {
  let th = document.createElement("th");
  th.textContent = header;
  headerRow.appendChild(th);
}
final_table.querySelector("thead").appendChild(headerRow);

// Add table data
for (let i = 1; i < rows.length; i++) {
  let data = rows[i].split("/");
  let rowElement = document.createElement("tr");

  for (let value of data) {
    let columnElement = document.createElement("td");
    columnElement.textContent = value;
    rowElement.appendChild(columnElement);
  }

  final_table.querySelector("tbody").appendChild(rowElement);
}
//Hidden Markov Model Modal
hmm_observation_HTML = `trajectory_id/start_point/ end_point/ path/ time_period/ Observation Sequence
(2020, 3, 7, ‘46100056’)/ POI1/ POI19/ [‘POI1’, ‘POI3’, ‘POI13’, ‘POI7’, ‘POI19’]/ [‘morning’, ‘morning’, ‘afternoon’, ‘afternoon’, ‘afternoon’]/ [5, 13, 44, 30, 78] 
(2020, 3, 7, '461000c7')/ POI24/ POI13/ ['POI24', 'POI24', 'POI6', 'POI8', 'POI9', 'POI13']/ ['morning', 'afternoon', 'afternoon', 'afternoon', 'afternoon', 'afternoon']/ [97, 98, 26, 34, 38, 54] 
(2020, 3, 7, '461000b5')/ POI13/ POI24/ ['POI13', 'POI9', 'POI0', 'POI8', 'POI24']/ ['morning', 'morning', 'morning', 'morning', 'morning']/ [53, 37, 1, 33,97] 
`;
let hmm_table = document.getElementById("hmm-table-container");
rows = hmm_observation_HTML.trim().split("\n");
headers = rows[0].split("/");

// Clear previous table content
hmm_table.querySelector("thead").innerHTML = "";
hmm_table.querySelector("tbody").innerHTML = "";

// Add table headers
headerRow = document.createElement("tr");
for (let header of headers) {
  let th = document.createElement("th");
  th.textContent = header;
  headerRow.appendChild(th);
}
hmm_table.querySelector("thead").appendChild(headerRow);

// Add table data
for (let i = 1; i < rows.length; i++) {
  let data = rows[i].split("/");
  let rowElement = document.createElement("tr");

  for (let value of data) {
    let columnElement = document.createElement("td");
    columnElement.textContent = value;
    rowElement.appendChild(columnElement);
  }

  hmm_table.querySelector("tbody").appendChild(rowElement);
}
//Fast Map Matching Modal

// result

result_HTML = `번호,K = 25,K = 50,K = 75,K = 100
전체 모델,76.60%,74.05%,75.74%,72.46%
SPRING 모델,80.58%,75.97%,72.58%,77.53%
SUMMER 모델,80.25%,75.86%,75.70%,78.30%
FALL 모델,75.44%,71.52%,73.67%,75.27%
WINTER 모델,75.54%,78.84%,74.04%,74.54%
`;
let result_table = document.getElementById("result-table-container");
rows = result_HTML.trim().split("\n");
headers = rows[0].split(",");

// Clear previous table content
result_table.querySelector("thead").innerHTML = "";
result_table.querySelector("tbody").innerHTML = "";

// Add table headers
headerRow = document.createElement("tr");
for (let header of headers) {
  let th = document.createElement("th");
  th.textContent = header;
  headerRow.appendChild(th);
}
result_table.querySelector("thead").appendChild(headerRow);

// Add table data
for (let i = 1; i < rows.length; i++) {
  let data = rows[i].split(",");
  let rowElement = document.createElement("tr");

  for (let value of data) {
    let columnElement = document.createElement("td");
    columnElement.textContent = value;
    rowElement.appendChild(columnElement);
  }

  result_table.querySelector("tbody").appendChild(rowElement);
}

drawing_font_image("Someori\nOreum", "1.svg");
