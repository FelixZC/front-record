MySQL是一个广泛使用的开源关系型数据库管理系统。以下是MySQL中一些常用的命令，涵盖数据库和数据表的管理、数据操作以及用户权限管理等方面：

### 连接与登出
- **连接MySQL服务器**  
  ```bash
  mysql -u 用户名 -p
  ```
  输入命令后，会提示输入用户密码。

- **退出MySQL**  
  在MySQL命令行中输入：
  ```sql
  quit
  ```

### 数据库操作
- **显示所有数据库**  
  ```sql
  show databases;
  ```

- **创建数据库**  
  ```sql
  create database 数据库名;
  ```

- **选择数据库**  
  ```sql
  use 数据库名;
  ```

- **删除数据库**  
  ```sql
  drop database 数据库名;
  ```

### 数据表操作
- **显示当前数据库的所有表**  
  ```sql
  show tables;
  ```

- **创建表**  
  示例创建一个用户表：
  ```sql
  create table users (
    id int primary key,
    username varchar(50),
    password varchar(50)
  );
  ```

- **查看表结构**  
  ```sql
  describe 表名;
  ```

- **插入数据**  
  ```sql
  insert into 表名 (列1, 列2, ...) values (值1, 值2, ...);
  ```

- **更新数据**  
  ```sql
  update 表名 set 列名 = 新值 where 条件;
  ```

- **删除数据**  
  ```sql
  delete from 表名 where 条件;
  ```

- **删除表**  
  ```sql
  drop table 表名;
  ```

### 数据查询
- **基本查询**  
  ```sql
  select * from 表名;
  ```

- **条件查询**  
  ```sql
  select * from 表名 where 条件;
  ```

### 用户管理与权限
- **添加新用户**  
  ```sql
  create user '新用户名'@'localhost' identified by '密码';
  ```

- **授予权限**  
  ```sql
  grant 权限列表 ON 数据库名.表名 TO '用户名'@'访问来源';
  ```
  例如，授予所有权限：
  ```sql
  grant all privileges on *.* to '用户名'@'%' identified by '密码';
  ```

- **撤销权限**  
  ```sql
  revoke 权限列表 ON 数据库名.表名 FROM '用户名'@'访问来源';
  ```

- **刷新权限**  
  ```sql
  flush privileges;
  ```

### 事务控制
- **开始事务**  
  ```sql
  start transaction;
  ```

- **提交事务**  
  ```sql
  commit;
  ```

- **回滚事务**  
  ```sql
  rollback;
  ```

以上只是MySQL命令的一部分，实际应用中可能还会用到更多高级功能和命令。