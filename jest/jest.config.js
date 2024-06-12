// jest.config.js
module.exports = {
    // 指定测试文件的匹配模式
    testRegex: '.*\.(test|spec)\.[tj]sx?$',
    
    // 支持 ES6 模块和 JSX
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    
    // 收集代码覆盖率信息
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text-summary', 'lcov'],
  
    // 设置模块解析选项
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
    // TypeScript 配置（如果使用 TypeScript）
    globals: {
      'ts-jest': {
        tsconfig: './tsconfig.json', // 指向您的tsconfig.json路径，例如 './tsconfig.json'
      },
    },
  
    // 如果有需要覆盖默认的transformer，可以在这里设置
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest'
    },
  };