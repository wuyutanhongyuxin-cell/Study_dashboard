import type { TreeNode } from './math-tree';

export const majorTree: TreeNode[] = [
  {
    name: '数字电路',
    description: '数字电路是电子信息专业综合的重要内容，研究数字信号的处理与逻辑设计。',
    children: [
      {
        name: '数制与编码',
        description: '各种数制及编码方式的基础知识。',
        children: [
          { name: '进制转换', description: '二进制、八进制、十六进制与十进制之间的转换。' },
          { name: '编码方式', description: 'BCD码、格雷码、ASCII码等编码规则。' },
        ],
      },
      {
        name: '组合逻辑电路',
        description: '输出仅取决于当前输入的逻辑电路。',
        children: [
          { name: '逻辑代数基础', description: '布尔代数公理与定理、逻辑函数化简（卡诺图法）。' },
          { name: '常用组合电路', description: '编码器、译码器、多路选择器、比较器、加法器。' },
          { name: '组合电路设计与分析', description: '组合逻辑电路的设计方法与竞争冒险。' },
        ],
      },
      {
        name: '时序逻辑电路',
        description: '输出与当前输入及过去状态有关的逻辑电路。',
        children: [
          { name: '触发器', description: 'SR触发器、JK触发器、D触发器、T触发器的工作原理。' },
          { name: '计数器', description: '同步计数器、异步计数器的设计与分析。' },
          { name: '时序电路设计', description: '状态图、状态表、状态编码与时序电路综合设计。' },
        ],
      },
      {
        name: '存储器',
        description: '各类存储器的结构与工作原理。',
        children: [
          { name: 'RAM', description: 'SRAM和DRAM的结构、工作原理与特点。' },
          { name: 'ROM', description: 'ROM、PROM、EPROM、EEPROM的结构与应用。' },
        ],
      },
      {
        name: '可编程逻辑器件',
        description: '可由用户编程实现特定逻辑功能的集成电路。',
        children: [
          { name: 'PLD基础', description: 'PAL、GAL的结构与编程原理。' },
          { name: 'FPGA与CPLD', description: 'FPGA和CPLD的结构特点、开发流程与应用。' },
        ],
      },
    ],
  },
  {
    name: '模拟电路',
    description: '模拟电路处理连续变化的模拟信号，是电子信息的基础学科。',
    children: [
      {
        name: '半导体基础',
        description: '半导体器件的物理基础与基本特性。',
        children: [
          { name: 'PN结与二极管', description: 'PN结的形成、二极管的伏安特性与模型。' },
          { name: '三极管与场效应管', description: 'BJT和MOSFET的结构、工作原理与特性曲线。' },
        ],
      },
      {
        name: '放大电路',
        description: '基本放大电路的分析与设计。',
        children: [
          { name: '共射/共源放大电路', description: '静态工作点分析、动态小信号模型。' },
          { name: '多级放大电路', description: '级间耦合方式、多级放大电路的分析方法。' },
          { name: '差分放大电路', description: '差模与共模信号、共模抑制比、差分对管电路。' },
        ],
      },
      {
        name: '运算放大器',
        description: '集成运放的特性与典型应用电路。',
        children: [
          { name: '理想运放与虚短虚断', description: '理想运放模型、虚短和虚断条件的应用。' },
          { name: '基本运算电路', description: '比例、加法、减法、积分、微分运算电路。' },
          { name: '有源滤波器', description: '低通、高通、带通、带阻有源滤波器的设计。' },
        ],
      },
      {
        name: '反馈',
        description: '反馈的基本概念及其对放大电路性能的影响。',
        children: [
          { name: '反馈类型判断', description: '正反馈与负反馈、电压与电流反馈、串联与并联反馈。' },
          { name: '负反馈对性能的影响', description: '增益稳定性、带宽、失真、输入输出阻抗的改善。' },
        ],
      },
      {
        name: '信号产生与变换',
        description: '振荡器与信号变换电路。',
        children: [
          { name: '正弦波振荡器', description: 'RC振荡器、LC振荡器、石英晶体振荡器。' },
          { name: '非正弦波产生电路', description: '比较器、方波/三角波/锯齿波发生器。' },
        ],
      },
      {
        name: '功率放大电路',
        description: '大信号放大电路的分类与设计。',
        children: [
          { name: '功放分类', description: '甲类、乙类、甲乙类功率放大电路的特点。' },
          { name: 'OCL与OTL电路', description: '互补对称功率放大电路的结构与效率分析。' },
        ],
      },
    ],
  },
  {
    name: '信号与系统',
    description: '信号与系统研究信号的分析与系统的响应，是电子信息的理论基础。',
    children: [
      {
        name: '连续时间信号与系统',
        description: '连续时间信号的描述与LTI系统的时域分析。',
        children: [
          { name: '信号的分类与运算', description: '确定信号与随机信号、信号的时移、反折、尺度变换。' },
          { name: '卷积积分', description: '卷积的定义、计算方法与性质。' },
          { name: 'LTI系统的时域分析', description: '微分方程的经典解法、零输入响应与零状态响应。' },
        ],
      },
      {
        name: '傅里叶变换',
        description: '信号的频域分析方法。',
        children: [
          { name: '傅里叶级数', description: '周期信号的傅里叶级数展开、频谱分析。' },
          { name: '傅里叶变换', description: '非周期信号的傅里叶变换、常用变换对与性质。' },
          { name: '频域系统分析', description: '频率响应、理想滤波器、采样定理。' },
        ],
      },
      {
        name: '拉普拉斯变换',
        description: '复频域分析方法。',
        children: [
          { name: '拉氏变换的定义与性质', description: '单边拉氏变换、收敛域、常用变换对。' },
          { name: '拉氏变换求解微分方程', description: '利用拉氏变换求解LTI系统的全响应。' },
        ],
      },
      {
        name: '离散时间信号与系统',
        description: '离散时间信号的表示与离散系统分析。',
        children: [
          { name: '离散信号与运算', description: '常见离散序列、序列运算、卷积和。' },
          { name: '离散系统的时域分析', description: '差分方程的求解、单位样值响应。' },
        ],
      },
      {
        name: 'Z变换',
        description: '离散系统的Z域分析方法。',
        children: [
          { name: 'Z变换的定义与性质', description: 'Z变换定义、收敛域、常用变换对。' },
          { name: 'Z逆变换', description: '部分分式法、长除法求Z逆变换。' },
          { name: 'Z变换求解差分方程', description: '利用Z变换分析离散LTI系统。' },
        ],
      },
      {
        name: '系统函数与系统特性',
        description: '系统函数的分析及稳定性判断。',
        children: [
          { name: '系统函数', description: '系统函数的定义、零极点分布与系统特性。' },
          { name: '系统稳定性', description: '连续系统与离散系统的稳定性判据。' },
        ],
      },
    ],
  },
];
