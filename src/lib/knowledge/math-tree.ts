export interface TreeNode {
  name: string;
  description: string;
  children?: TreeNode[];
}

export const mathTree: TreeNode[] = [
  {
    name: '高等数学',
    description: '高等数学是数学一的核心内容，涵盖微积分、级数与微分方程等。',
    children: [
      {
        name: '极限与连续',
        description: '函数极限的定义、性质与计算，连续性与间断点分类。',
        children: [
          { name: '数列极限', description: '数列极限的定义、单调有界准则、夹逼准则。' },
          { name: '函数极限', description: '函数极限的定义与计算，等价无穷小替换。' },
          { name: '连续与间断', description: '函数连续性的定义，间断点的分类与判定。' },
          { name: '闭区间上连续函数的性质', description: '最值定理、介值定理、零点定理。' },
        ],
      },
      {
        name: '一元函数微分学',
        description: '导数与微分的概念、计算及应用。',
        children: [
          { name: '导数与微分', description: '导数定义、求导法则、高阶导数、微分概念。' },
          { name: '微分中值定理', description: 'Rolle定理、Lagrange中值定理、Cauchy中值定理、Taylor公式。' },
          { name: '导数应用', description: '函数单调性、极值、凹凸性、拐点、渐近线。' },
        ],
      },
      {
        name: '一元函数积分学',
        description: '不定积分与定积分的概念、计算及应用。',
        children: [
          { name: '不定积分', description: '基本积分公式、换元积分法、分部积分法。' },
          { name: '定积分', description: '定积分的定义与性质、牛顿-莱布尼茨公式。' },
          { name: '反常积分', description: '无穷区间上的反常积分、无界函数的反常积分。' },
          { name: '定积分应用', description: '面积、体积、弧长、旋转体侧面积的计算。' },
        ],
      },
      {
        name: '多元函数微积分',
        description: '多元函数的极限、连续、偏导数与重积分。',
        children: [
          { name: '多元函数微分学', description: '偏导数、全微分、方向导数与梯度、隐函数定理。' },
          { name: '多元函数极值', description: '无条件极值、条件极值与拉格朗日乘数法。' },
          { name: '重积分', description: '二重积分与三重积分的计算，极坐标与柱坐标变换。' },
          { name: '曲线与曲面积分', description: '第一类和第二类曲线积分、曲面积分，Green公式、Stokes公式、Gauss公式。' },
        ],
      },
      {
        name: '无穷级数',
        description: '数项级数与函数项级数的收敛性及展开。',
        children: [
          { name: '数项级数', description: '收敛与发散的判别法，正项级数、交错级数、绝对与条件收敛。' },
          { name: '幂级数', description: '收敛半径与收敛域、幂级数的求和。' },
          { name: 'Fourier级数', description: '函数的Fourier展开，Dirichlet收敛定理。' },
        ],
      },
      {
        name: '常微分方程',
        description: '常微分方程的基本解法与应用。',
        children: [
          { name: '一阶微分方程', description: '可分离变量方程、齐次方程、一阶线性方程、伯努利方程。' },
          { name: '高阶线性微分方程', description: '线性微分方程的解的结构、常系数齐次与非齐次方程。' },
          { name: '微分方程应用', description: '几何与物理中的微分方程建模与求解。' },
        ],
      },
    ],
  },
  {
    name: '线性代数',
    description: '线性代数研究向量空间与线性变换，是数学一的重要组成部分。',
    children: [
      {
        name: '行列式',
        description: '行列式的定义、性质与计算。',
        children: [
          { name: '行列式的性质', description: '行列互换、行（列）倍加、行（列）提取公因子。' },
          { name: '行列式的展开', description: '按行（列）展开、代数余子式、Laplace展开。' },
          { name: '行列式的计算', description: '特殊行列式的计算方法、Cramer法则。' },
        ],
      },
      {
        name: '矩阵',
        description: '矩阵的运算、性质与初等变换。',
        children: [
          { name: '矩阵运算', description: '矩阵的加法、数乘、乘法、转置。' },
          { name: '逆矩阵', description: '逆矩阵的定义、性质与求法（伴随矩阵法、初等变换法）。' },
          { name: '矩阵的秩', description: '矩阵秩的定义与求法，初等行变换化阶梯形。' },
        ],
      },
      {
        name: '向量',
        description: '向量的线性相关性与向量空间。',
        children: [
          { name: '线性相关与无关', description: '线性相关与无关的定义、判定与性质。' },
          { name: '向量组的秩', description: '极大无关组、向量组等价、向量空间的基与维数。' },
        ],
      },
      {
        name: '线性方程组',
        description: '线性方程组解的存在性与解的结构。',
        children: [
          { name: '齐次方程组', description: '齐次方程组有非零解的条件，基础解系。' },
          { name: '非齐次方程组', description: '非齐次方程组有解的条件，解的结构。' },
          { name: '方程组的应用', description: '利用方程组理论求解实际问题。' },
        ],
      },
      {
        name: '特征值与特征向量',
        description: '矩阵的特征值、特征向量与对角化。',
        children: [
          { name: '特征值与特征向量的求解', description: '特征方程、特征值的性质、特征向量的求法。' },
          { name: '相似对角化', description: '矩阵可对角化的条件、相似变换。' },
          { name: '实对称矩阵', description: '实对称矩阵的特征值与特征向量的性质，正交对角化。' },
        ],
      },
      {
        name: '二次型',
        description: '二次型的矩阵表示与标准化。',
        children: [
          { name: '二次型与标准形', description: '二次型的矩阵表示、配方法与正交变换化标准形。' },
          { name: '正定二次型', description: '正定的定义与判定条件（特征值、顺序主子式）。' },
        ],
      },
    ],
  },
  {
    name: '概率论与数理统计',
    description: '概率论与数理统计是数学一中研究随机现象规律的部分。',
    children: [
      {
        name: '随机事件与概率',
        description: '概率的基本概念与计算。',
        children: [
          { name: '事件关系与运算', description: '事件的并、交、差、对立，概率的公理化定义。' },
          { name: '条件概率与独立性', description: '条件概率、全概率公式、Bayes公式、事件独立性。' },
        ],
      },
      {
        name: '随机变量及其分布',
        description: '一维随机变量的分布及其数字特征。',
        children: [
          { name: '离散型随机变量', description: '常见分布：二项分布、Poisson分布、几何分布。' },
          { name: '连续型随机变量', description: '概率密度函数、均匀分布、指数分布、正态分布。' },
          { name: '分布函数', description: '分布函数的定义、性质及随机变量函数的分布。' },
        ],
      },
      {
        name: '多维随机变量',
        description: '多维随机变量的联合分布与边缘分布。',
        children: [
          { name: '联合分布', description: '联合分布函数、联合密度函数、联合分布律。' },
          { name: '边缘分布与条件分布', description: '边缘分布、条件分布、随机变量的独立性。' },
          { name: '多维随机变量函数的分布', description: '和、极值等函数的分布，卷积公式。' },
        ],
      },
      {
        name: '数字特征',
        description: '随机变量的期望、方差及相关系数。',
        children: [
          { name: '期望与方差', description: '数学期望的定义与性质、方差的计算。' },
          { name: '协方差与相关系数', description: '协方差的定义、相关系数、不相关与独立的关系。' },
          { name: '矩与矩母函数', description: '各阶矩的定义与计算。' },
        ],
      },
      {
        name: '大数定律与中心极限定理',
        description: '描述大量随机变量和的渐近行为。',
        children: [
          { name: '大数定律', description: '切比雪夫大数定律、辛钦大数定律、伯努利大数定律。' },
          { name: '中心极限定理', description: 'Lindeberg-Levy中心极限定理、DeMoivre-Laplace定理。' },
        ],
      },
      {
        name: '数理统计基础',
        description: '统计量与常用抽样分布。',
        children: [
          { name: '统计量与抽样分布', description: '统计量的定义，卡方分布、t分布、F分布。' },
          { name: '参数估计', description: '矩估计、最大似然估计、估计量的评价标准。' },
          { name: '假设检验', description: '假设检验的基本思想，Z检验、t检验、卡方检验。' },
        ],
      },
    ],
  },
];
