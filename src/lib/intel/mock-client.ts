import type { CrawlResult } from './types';

export class MockDecodoClient {
  async universalScrape(): Promise<CrawlResult[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
      // Policy items
      {
        title: '上海交通大学2026年硕士研究生招生简章发布',
        summary: '上海交通大学研究生院发布2026年硕士研究生招生简章，集成电路学院计划招收学术型硕士30人、专业型硕士80人。报名时间为2025年10月8日至10月25日，初试时间为2025年12月下旬。今年新增"集成电路科学与工程"一级学科博士点直博名额。',
        url: 'https://yzb.sjtu.edu.cn/info/1002/3456.htm',
        source: '上海交通大学研究生院',
        category: 'policy',
        relevance: 0.98,
      },
      {
        title: '集成电路学院2026年推免生复试安排',
        summary: '集成电路学院公布2026年推荐免试研究生复试安排，复试采用线上线下结合方式。学术型硕士复试包含专业课笔试和综合面试，专业型硕士复试重点考察工程实践能力。推免生占比约40%，统考名额相应调整。',
        url: 'https://ic.sjtu.edu.cn/news/2025/0901.htm',
        source: '上海交通大学集成电路学院',
        category: 'policy',
        relevance: 0.95,
      },
      {
        title: '874电子信息专业综合考试大纲更新',
        summary: '2026年874科目考试大纲已更新，新增数字集成电路设计部分（约占15%），模拟电路部分比例调整为35%，信号与系统保持50%不变。参考书目新增《数字集成电路——电路、系统与设计》第二版。',
        url: 'https://ic.sjtu.edu.cn/exam/874_2026.htm',
        source: '上海交通大学集成电路学院',
        category: 'policy',
        relevance: 0.99,
      },

      // Experience items
      {
        title: '上交集成电路初试410分学长经验分享',
        summary: '2025年上岸学长分享备考经验：数学一146分的关键是每天3小时高强度刷题+错题本复盘，874专业课135分靠的是把教材例题吃透。建议7月前完成基础阶段，8-10月强化，最后两个月冲刺真题。政治不要太早开始，9月肖秀荣足矣。',
        url: 'https://www.zhihu.com/question/12345678/answer/98765432',
        source: '知乎',
        category: 'experience',
        relevance: 0.92,
      },
      {
        title: '三跨考生上交IC经验：从机械到集成电路',
        summary: '跨考生分享从机械工程跨考到集成电路学院的心路历程。874专业课从零开始，花了4个月打好模电信号基础。重点强调了《信号与系统》奥本海姆版本的重要性，以及模拟电路要多做分析题而非死记公式。最终初试385分成功上岸。',
        url: 'https://bbs.kaoyan.com/thread-9876543.html',
        source: '考研论坛',
        category: 'experience',
        relevance: 0.88,
      },
      {
        title: '上交874真题解析与高频考点总结（2020-2025）',
        summary: '整理了近6年874真题的高频考点：运算放大器电路分析（每年必考）、傅里叶变换与拉普拉斯变换（分值最高）、反馈电路稳定性分析、采样定理应用。附带详细解题思路和易错点标注，建议打印出来反复练习。',
        url: 'https://www.xiaohongshu.com/explore/abc123',
        source: '小红书',
        category: 'experience',
        relevance: 0.94,
      },

      // Resource items
      {
        title: '874电子信息专业综合核心教材PDF合集',
        summary: '整理了874考试所需核心教材电子版：《信号与系统》(奥本海姆)、《模拟电子技术基础》(童诗白)、《数字集成电路》(Rabaey)。包含课后习题答案和重点章节标注，适合系统性复习使用。',
        url: 'https://pan.baidu.com/s/1example874',
        source: '考研资料站',
        category: 'resource',
        relevance: 0.90,
      },
      {
        title: 'MIT 6.002电路与电子学公开课（中英字幕）',
        summary: 'MIT OpenCourseWare经典课程6.002的完整视频，含中英文字幕。内容涵盖电路分析基础、运算放大器、数字电路基础等，与874考试内容高度相关。配套实验和作业可帮助深入理解概念。',
        url: 'https://www.bilibili.com/video/BV1example',
        source: 'B站',
        category: 'resource',
        relevance: 0.82,
      },
      {
        title: '信号与系统学习路线图及配套题库',
        summary: '为874备考整理的信号与系统学习路线：第一轮跟教材+视频打基础（6周），第二轮刷郑君里版习题集（4周），第三轮真题+模拟题冲刺（3周）。附带600+精选习题，按难度分级标注。',
        url: 'https://github.com/example/signals-study',
        source: 'GitHub',
        category: 'resource',
        relevance: 0.86,
      },

      // News items
      {
        title: '国家集成电路产业投资基金三期成立，IC人才需求激增',
        summary: '大基金三期正式成立，注册资本超3400亿元，重点投向先进制程、EDA工具和IC设计。业内预计未来5年集成电路领域人才缺口将达25万人，研究生学历以上人才尤为紧缺，各高校IC学院招生规模有望进一步扩大。',
        url: 'https://www.eet-china.com/news/202509_example.html',
        source: '电子工程专辑',
        category: 'news',
        relevance: 0.78,
      },
      {
        title: '上海交通大学集成电路学院新增2个研究方向',
        summary: '上交集成电路学院宣布2026年新增"AI芯片设计"和"先进封装技术"两个研究方向，分别由从海外引进的两位青年教授领衔。新方向将开放硕士和博士招生名额，为有志于前沿芯片研究的考生提供更多选择。',
        url: 'https://ic.sjtu.edu.cn/news/2025/1015.htm',
        source: '上海交通大学集成电路学院',
        category: 'news',
        relevance: 0.85,
      },
      {
        title: '2026考研报名人数预计回落，竞争格局分析',
        summary: '教育部数据显示2026年考研报名人数预计为380万，较去年下降8%。但热门学科如集成电路、人工智能方向的报录比依然高企，预计上交IC学院统考报录比约为8:1。建议考生理性选择，充分准备。',
        url: 'https://edu.sina.cn/kaoyan/2025-11-example',
        source: '新浪教育',
        category: 'news',
        relevance: 0.75,
      },
    ];
  }
}
