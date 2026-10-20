/* Site content — edit here, not in HTML.
   Each text field: { en, ko }. Empty string = hidden on the page. */

/* Copyright years: "2026" in the first year, "2026–2027" afterwards */
window.COPYRIGHT_YEARS = (function (start) {
  const now = new Date().getFullYear();
  return now > start ? `${start}–${now}` : String(start);
})(2026);

window.SITE = {
  owner: "Hayoon Park",
  role: { en: "Architectural designer & researcher", ko: "건축 디자이너 · 연구자" },
  links: {
    email: "",          // e.g. "name@domain.com" — left blank until you decide to publish it
    linkedin: "",       // full URL
    instagram: "",      // full URL
    github: "https://github.com/Yooniversity"
  },

  statement: {
    en: "Timber tectonics, heritage reversibility and computational evidence — designing structures that can be taken apart as carefully as they are put together.",
    ko: "목조 텍토닉스(Timber tectonics), 유산의 가역성(Heritage reversibility), 계산적 근거(Computational evidence) — 조립만큼 신중하게 해체될 수 있는 구조를 설계합니다."
  },

  axes: [
    {
      title: { en: "Timber tectonics", ko: "목조 텍토닉스" },
      body: {
        en: "Reading structure through material: how CLT, glulam and traditional joinery carry load, and how that logic becomes architectural expression.",
        ko: "재료로 구조를 읽는다. CLT·글루램·전통 결구가 하중을 전달하는 방식, 그리고 그 논리가 건축적 표현이 되는 과정."
      }
    },
    {
      title: { en: "Heritage reversibility", ko: "유산의 가역성" },
      body: {
        en: "Interventions in historic fabric that leave no permanent trace — dry joints, modular interfaces and minimum-contact fixings.",
        ko: "역사적 건축물에 영구적 흔적을 남기지 않는 개입 — 건식 접합(Dry joint), 모듈형 인터페이스, 최소 접촉 고정."
      }
    },
    {
      title: { en: "Computational evidence", ko: "계산적 근거" },
      body: {
        en: "Design claims tested with data: GIS for urban fabric, Karamba3D for structure, Python for repeatable analysis.",
        ko: "데이터로 검증하는 설계: 도시 조직은 GIS, 구조는 Karamba3D, 반복 분석은 Python."
      }
    }
  ],

  /* Project register. status: "ongoing" | "complete" | "concept" */
  projects: [
    {
      id: "jongno",
      ref: "P-01",
      title: { en: "Jongno Masterplan + Mass Timber Tower Prototype", ko: "종로 마스터플랜 + 매스팀버 타워 프로토타입" },
      type: { en: "Urban design / Mass timber", ko: "도시설계 / 매스팀버" },
      status: "ongoing",
      year: "2026",
      summary: {
        en: "A critique of the Gongpyeong-dong rule, proposed as a city-scale system across four to six blocks in three layers: an underground heritage pedestrian network, surface open space tied to density incentives, and a repeatable 15–20 storey timber tower.",
        ko: "공평동 룰에 대한 비평에서 출발해 4–6개 블록 규모의 도시 시스템을 세 개의 레이어로 제안한다: 지하 유산 보행망, 용적 인센티브와 연동된 지상 오픈스페이스, 반복 가능한 15–20층 목조 타워."
      },
      facts: [
        { k: { en: "Structure", ko: "구조" }, v: { en: "RC core, CLT slabs, glulam columns", ko: "RC 코어, CLT 슬래브, 글루램 기둥" } },
        { k: { en: "Height", ko: "규모" }, v: { en: "15–20 storeys", ko: "15–20층" } },
        { k: { en: "Precedents", ko: "선례" }, v: { en: "Brock Commons, Ascent", ko: "Brock Commons, Ascent" } },
        { k: { en: "Tools", ko: "도구" }, v: { en: "QGIS, Grasshopper, Karamba3D, Rhino, V-Ray", ko: "QGIS, Grasshopper, Karamba3D, Rhino, V-Ray" } }
      ],
      next: {
        en: "In development: Revit model, Karamba3D structural checks, embodied-carbon quantification.",
        ko: "진행 예정: Revit 모델화, Karamba3D 구조 검증, 내재탄소(Embodied carbon) 정량화."
      },
      images: [] // e.g. [{ src: "assets/img/jongno-01.jpg", caption: { en: "...", ko: "..." } }]
    },
    {
      id: "zero-impact",
      ref: "P-02",
      title: { en: "Zero-Impact — Heritage interfaces", ko: "Zero-Impact — 유산 인터페이스" },
      type: { en: "Heritage tech / Product", ko: "헤리티지 테크 / 제품" },
      status: "concept",
      year: "2026",
      summary: {
        en: "Modular, reversible interfaces for bringing services into historic settlements without altering the original form of the house.",
        ko: "주택의 원형(原形)을 훼손하지 않고 역사마을에 설비를 들이는 모듈형·가역 인터페이스."
      },
      facts: [
        { k: { en: "Principle", ko: "원칙" }, v: { en: "Dry joints, no permanent fixing", ko: "건식 접합, 영구 고정 없음" } },
        { k: { en: "Scope", ko: "범위" }, v: { en: "Not limited to a single period", ko: "특정 시대에 한정하지 않음" } }
      ],
      next: {
        en: "In development: brand identity, prototype details, concept paper.",
        ko: "진행 예정: 브랜드 아이덴티티, 프로토타입 디테일, 사업 개념서."
      },
      images: []
    },
    {
      id: "auri",
      ref: "R-01",
      title: { en: "Spatial conflict in folk villages", ko: "민속마을 공간갈등 연구" },
      type: { en: "Research / GIS", ko: "연구 / GIS" },
      status: "ongoing",
      year: "2026",
      summary: {
        en: "Research with AURI on spatial conflict across Korean folk heritage villages, mapped and analysed with QGIS and Python.",
        ko: "AURI와 함께 진행하는 민속마을 공간갈등 연구. QGIS와 Python으로 매핑·분석한다."
      },
      facts: [
        { k: { en: "Partner", ko: "협력" }, v: { en: "AURI", ko: "건축공간연구원(AURI)" } },
        { k: { en: "Tools", ko: "도구" }, v: { en: "QGIS, Python", ko: "QGIS, Python" } }
      ],
      next: {
        en: "In development: data visualisation and a browsable web archive.",
        ko: "진행 예정: 데이터 시각화 및 웹 아카이브."
      },
      images: []
    }
  ],

  /* Writing / ongoing publishing. url empty = shown as "coming". */
  journal: [
    { title: { en: "Daily Radar", ko: "Daily Radar" }, body: { en: "AEC news, UK/EU openings and deadlines, every morning.", ko: "AEC 뉴스, 영국·유럽 채용, 공모·펠로십 마감 — 매일 아침." }, url: "" },
    { title: { en: "Weekly brief", ko: "Weekly brief" }, body: { en: "Mass timber, retrofit and heritage across Korea, the UK and the US.", ko: "한국·영국·미국의 매스팀버, 리트로핏, 유산 동향." }, url: "" },
    { title: { en: "Translation", ko: "번역" }, body: { en: "Korean translation of Valerio Olgiati, Non-Referential Architecture (contributor).", ko: "발레리오 올지아티 『Non-Referential Architecture』 한국어판 번역 참여." }, url: "" }
  ],

  about: {
    en: "I work between traditional Korean timber construction and contemporary mass timber, with a focus on retrofit, decarbonisation and conservation. I am looking to join a practice in the UK working on mass timber and retrofit.",
    ko: "한국 전통 목조건축과 현대 매스팀버 사이에서 작업하며, 리트로핏·탈탄소·보존에 집중합니다. 영국의 매스팀버·리트로핏 실무에 합류하고자 합니다."
  },
  education: [
    { en: "M.Arch, Seoul National University — traditional Korean timber structures", ko: "서울대학교 건축학 석사 — 한국 전통 목조건축" },
    { en: "B.Arch, Hongik University", ko: "홍익대학교 건축학 학사" }
  ],
  toolkit: ["Rhino", "Grasshopper", "Karamba3D", "Python", "QGIS", "Revit", "V-Ray", "D5", "SketchUp", "Adobe CC"]
};
