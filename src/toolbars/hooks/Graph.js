/**
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import MenuBase from '@/toolbars/MenuBase';

/**
 * 插入“画图”的按钮
 * 本功能依赖[Mermaid.js](https://mermaid-js.github.io)组件，请保证调用CherryMarkdown前已加载mermaid.js组件
 */
export default class Graph extends MenuBase {
  constructor($cherry) {
    super($cherry);
    this.setName('graph', 'account_tree');
    this.localeName = $cherry.options.locale;
    this.subMenuConfig = [
      // 流程图
      // 访问[Mermaid 流程图](https://mermaid-js.github.io/mermaid/#/flowchart)参考具体使用方法。
      {
        iconName: 'device_hub',
        name: 'insertFlow',
        onclick: this.bindSubClick.bind(
          this,
          `flowchart TD
    Start --> Stop
      `,
        ),
      },
      // 时序图
      // 访问[Mermaid 时序图](https://mermaid-js.github.io/mermaid/#/sequenceDiagram)参考具体使用方法
      {
        iconName: 'pending_actions',
        name: 'insertSeq',
        onclick: this.bindSubClick.bind(
          this,
          `sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!
      `,
        ),
      },
      // 状态图
      // 访问[Mermaid 状态图](https://mermaid-js.github.io/mermaid/#/stateDiagram)参考具体使用方法
      {
        iconName: 'location_away',
        name: 'insertState',
        onclick: this.bindSubClick.bind(
          this,
          `stateDiagram-v2
    s1 --> s2: A transition`,
        ),
      },
      // 类图
      // 访问[Mermaid UML图](https://mermaid-js.github.io/mermaid/#/classDiagram)参考具体使用方法
      {
        iconName: 'code',
        name: 'insertClass',
        onclick: this.bindSubClick.bind(
          this,
          `classDiagram
    class Animal
    Vehicle <|-- Car`,
        ),
      },
      // 饼图
      // 访问[Mermaid 饼图](https://mermaid-js.github.io/mermaid/#/pie)参考具体使用方法
      {
        iconName: 'pie_chart',
        name: 'insertPie',
        onclick: this.bindSubClick.bind(
          this,
          `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`,
        ),
      },
      // 甘特图
      {
        iconName: 'view_timeline',
        name: 'insertGantt',
        onclick: this.bindSubClick.bind(
          this,
          `gantt
    title A Gantt Diagram
    dateFormat YYYY-MM-DD
    section Section
        A task          :a1, 2014-01-01, 30d
        Another task    :after a1, 20d
    section Another
        Task in Another :2014-01-12, 12d
        another task    :24d`,
        ),
      },
      {
        iconName: 'schema',
        name: '实体关系图',
        onclick: this.bindSubClick.bind(
          this,
          `---
title: Order example
---
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
        ),
      },
      {
        iconName: 'waterfall_chart',
        name: '用户旅程图',
        onclick: this.bindSubClick.bind(
          this,
          `journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me`,
        ),
      },
      {
        iconName: 'square',
        name: '象限图',
        onclick: this.bindSubClick.bind(
          this,
          `quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]`,
        ),
      },
      {
        iconName: 'flowsheet',
        name: '需求图',
        onclick: this.bindSubClick.bind(
          this,
          `    requirementDiagram

    requirement test_req {
    id: 1
    text: the test text.
    risk: high
    verifymethod: test
    }

    element test_entity {
    type: simulation
    }

    test_entity - satisfies -> test_req`,
        ),
      },
      {
        iconName: 'linked_services',
        name: 'Git提交图',
        onclick: this.bindSubClick.bind(
          this,
          `    gitGraph
       commit
       commit
       commit`,
        ),
      },
      {
        iconName: 'bid_landscape',
        name: 'C4 图',
        onclick: this.bindSubClick.bind(
          this,
          `    C4Dynamic
    title Dynamic diagram for Internet Banking System - API Application

    ContainerDb(c4, "Database", "Relational Database Schema", "Stores user registration information, hashed authentication credentials, access logs, etc.")
    Container(c1, "Single-Page Application", "JavaScript and Angular", "Provides all of the Internet banking functionality to customers via their web browser.")
    Container_Boundary(b, "API Application") {
      Component(c3, "Security Component", "Spring Bean", "Provides functionality Related to signing in, changing passwords, etc.")
      Component(c2, "Sign In Controller", "Spring MVC Rest Controller", "Allows users to sign in to the Internet Banking System.")
    }
    Rel(c1, c2, "Submits credentials to", "JSON/HTTPS")
    Rel(c2, c3, "Calls isAuthenticated() on")
    Rel(c3, c4, "select * from users where username = ?", "JDBC")

    UpdateRelStyle(c1, c2, $textColor="red", $offsetY="-40")
    UpdateRelStyle(c2, c3, $textColor="red", $offsetX="-40", $offsetY="60")
    UpdateRelStyle(c3, c4, $textColor="red", $offsetY="-40", $offsetX="10")`,
        ),
      },
      {
        iconName: 'mindfulness',
        name: '思维导图',
        onclick: this.bindSubClick.bind(
          this,
          `mindmap
Root
    A
      B
      C`,
        ),
      },
      {
        iconName: 'chart_data',
        name: 'XY 图表',
        onclick: this.bindSubClick.bind(
          this,
          `xychart-beta
    title "Sales Revenue"
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
    y-axis "Revenue (in $)" 4000 --> 11000
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]
    line [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]`,
        ),
      },
      {
        iconName: 'view_timeline',
        name: '时间线',
        onclick: this.bindSubClick.bind(
          this,
          `timeline
    title History of Social Media Platform
    2002 : LinkedIn
    2004 : Facebook
         : Google
    2005 : Youtube
    2006 : Twitter`,
        ),
      },
      {
        iconName: 'full_stacked_bar_chart',
        name: '桑基图',
        onclick: this.bindSubClick.bind(
          this,
          `sankey-beta

%% source,target,value
Electricity grid,Over generation / exports,104.453
Electricity grid,Heating and cooling - homes,113.726
Electricity grid,H2 conversion,27.14`,
        ),
      },
    ];
  }

  getSubMenuConfig() {
    return this.subMenuConfig;
  }

  /**
   * 响应点击事件
   * @param {string} selection 被用户选中的文本内容，本函数不处理选中的内容，会直接清空用户选中的内容
   * @param {1|2|3|4|5|6|'1'|'2'|'3'|'4'|'5'|'6'|'flow'|'sequence'|'state'|'class'|'pie'|'gantt'|''} shortKey 快捷键参数
   * @returns {string} 回填到编辑器光标位置/选中文本区域的内容
   */
  onClick(selection, shortKey = '') {
    return `\n\`\`\`mermaid\n${shortKey.trim()}\n\`\`\`\n\n`;
  }
}
