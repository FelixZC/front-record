Vim 是一款功能强大的文本编辑器，以其高效和高度可配置性而受到许多程序员的喜爱。以下是 Vim 编辑器中的一些常用命令，分为不同模式进行介绍：

### 命令模式（Normal mode）命令
- `i`：进入输入模式（Insert mode），开始编辑文本。
- `x`：删除当前光标下的字符。
- `dd`：删除（剪切）当前行。
- `p`：粘贴之前删除（或剪切）的内容到光标之后。
- `u`：撤销上一次操作。
- `yy`：复制当前行到剪贴板。
- `hjkl`：分别代表左下上右，用于移动光标。
- `:w`：保存当前文件。
- `:wq` 或 `ZZ`：保存并退出。
- `:q!`：不保存并强制退出。
- `:e filename`：打开或新建文件。
- `/pattern`：搜索文本中的模式。
- `n/N`：在搜索结果中向前/向后跳转。

### 输入模式（Insert mode）
在此模式下，你可以直接输入文本。按 `Esc` 或 `Ctrl + [` 返回命令模式。

### 底线命令模式（Last line mode）
- 按 `:` 进入此模式。
- `:set nu`：显示行号。
- `:set nonu`：隐藏行号。
- `:sp filename`：水平分割窗口并打开文件。
- `:vs filename`：垂直分割窗口并打开文件。
- `:q`：尝试退出当前窗口（如果未做更改）。
- `:qa`：尝试退出所有窗口（如果所有窗口都未做更改）。
- `:qa!`：强制退出所有窗口，不保存任何更改。

### 其他常用命令
- `Ctrl + s`：暂停屏幕输出。
- `Ctrl + q`：恢复屏幕输出。
- `Ctrl + f`：页面下翻。
- `Ctrl + b`：页面上翻。
- `gg`：跳转到文件开头。
- `G`：跳转到文件末尾。
- `dw`：删除（剪切）从光标位置到单词结尾的内容。
- `d$`：删除（剪切）从光标位置到行尾的内容。
- `cw`：修改（更改）从光标位置到单词结尾的内容。
- `r`：替换当前光标下的字符。
- `R`：进入覆盖模式，连续替换字符。
- `.`：重复上一次的修改操作。

Vim 的命令非常丰富，上述仅为入门级常用命令。随着对 Vim 的深入使用，你可以通过组合键和自定义配置实现更加复杂的编辑操作。