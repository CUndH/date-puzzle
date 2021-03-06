# date-puzzle

## 介绍

![image](https://user-images.githubusercontent.com/28669643/121797659-4280f980-cc54-11eb-9062-977aa71f2a3c.png)

一个挺好玩的拼图游戏，通过自由组合8块拼图来拼出某一天的日期，拼图全部拼上棋盘以后会剩下2个空格。

比如这样：

![image](https://user-images.githubusercontent.com/28669643/121797423-b1f5e980-cc52-11eb-997a-333f0bb1649c.png)

剩下的2个空格组成的日期就是某一天的日期，这样就算拼完了。

### 实现逻辑
- 主要的拼图逻辑采用视图和数据分层处理
- 视图层控制了拖动，翻转，吸附等视觉效果
- 数据层定义了棋盘和拼块的矩阵，翻转拼块时通过删除旧拼块并更新矩阵后重新渲染新拼块，来定位拼块的吸附点（左上角），否则翻转后之前的吸附点就不是之后的吸附点了
- 拼图时，需要更新棋盘矩阵来实现判定路径是否合法，以及之后的拼图
- 移除已拼上的拼块后要相应的更新棋盘矩阵中修改的路径（未实现）



## 功能
- 拖动拼块到棋盘后，会自动吸附到最近的格子，吸附的判定坐标为拼块的左上角，无论左上角是有色格子还是无色格子
- 拖动拼块时，按 R 键可以顺时针90度旋转拼块。按 E 键可上下180度翻转拼块
- 已实现拼块路径判断，拼图时，需要保证拼块经过路径全合法（路径上不得超出棋盘，不得有其他拼块在路径上）

## 已知 BUG
- 频繁多次翻转可能会导致拼块翻转有误，或拼块消失
- 拼块拼到棋盘再取下后，棋盘矩阵并未删除移走拼块的数据
- 拖动拼块过快会导致拼块卡顿
- 翻转拼块后会有一定的吸附不精确问题
