export default [
  {
    id: 1,
    father_id: 0,
    status: 1,
    name: "生命科学竞赛",
    _child: [
      {
        id: 2,
        father_id: 1,
        status: 1,
        name: "野外实习类",
        _child: [
          { id: 3, father_id: 2, status: 1, name: "植物学" },
          { id: 4, father_id: 2, status: 1, name: "动物学" },
          { id: 5, father_id: 2, status: 1, name: "微生物学" },
          { id: 6, father_id: 2, status: 1, name: "生态学" },
        ],
      },
      {
        id: 7,
        father_id: 1,
        status: 1,
        name: "科学研究类",
        _child: [
          { id: 8, father_id: 7, status: 1, name: "植物学与植物生理学" },
          { id: 9, father_id: 7, status: 1, name: "动物学与动物生理学" },
          { id: 10, father_id: 7, status: 1, name: "微生物学" },
          { id: 11, father_id: 7, status: 1, name: "生态学" },
          {
            id: 21,
            father_id: 7,
            status: 1,
            name: "农学",
            _child: [
              { id: 22, father_id: 21, status: 1, name: "植物生产类" },
              { id: 23, father_id: 21, status: 1, name: "动物生产类" },
              { id: 24, father_id: 21, status: 1, name: "动物医学类" },
            ],
          },
          {
            id: 41,
            father_id: 7,
            status: 1,
            name: "药学",
            _child: [
              { id: 42, father_id: 41, status: 1, name: "植物学与植物生理学" },
              { id: 43, father_id: 41, status: 1, name: "动物学与动物生理学" },
              { id: 44, father_id: 41, status: 1, name: "微生物学" },
              { id: 45, father_id: 41, status: 1, name: "生态学" },
              {
                id: 46,
                father_id: 41,
                status: 1,
                name: "生物化学与分子生物学",
              },
              {
                id: 47,
                father_id: 41,
                status: 1,
                name: "细胞与发育生物学",
              },
              {
                id: 48,
                father_id: 41,
                status: 1,
                name: "遗传与生物信息学",
              },
              { id: 49, father_id: 41, status: 1, name: "环境科学" },
              {
                id: 53,
                father_id: 41,
                status: 1,
                name: "检测与检验",
              },
              {
                id: 54,
                father_id: 41,
                status: 1,
                name: "天然产物开发与利用",
              },
            ],
          },
          { id: 55, father_id: 7, status: 1, name: "其他" },
        ],
      },
      { id: 71, father_id: 1, status: 1, name: "添加" },
    ],
  },
  {
    id: 56,
    father_id: 0,
    status: 1,
    name: "考研相关",
    _child: [
      { id: 57, father_id: 56, status: 1, name: "政治" },
      { id: 58, father_id: 56, status: 1, name: "外国语" },
    ],
  },
  {
    id: 65,
    father_id: 0,
    status: 1,
    name: "找工作",
    _child: [
      { id: 66, father_id: 65, status: 1, name: "招聘会" },
      { id: 67, father_id: 65, status: 1, name: "简历" },
    ],
  },
  {
    id: 70,
    father_id: 0,
    status: 1,
    name: "其他",
    _child: [
      {
        id: 72,
        father_id: 70,
        status: 1,
        name: "新增的根级12311111",
      },
    ],
  },
];
