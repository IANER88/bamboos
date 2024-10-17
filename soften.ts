import * as babel from '@babel/core'
import type { Plugin } from 'vite'

export default function SoftenJSX(): Plugin {
  const virtual = 'virtual:soften-dom'
  const resolved_virtual = '\0' + virtual;

  return {
    name: 'soften',
    enforce: 'pre',
    config() {
      return {
        esbuild: {
          include: /\.ts$/,
        },
      }
    },
    configResolved() {
      // needHmr = config.command === 'serve' && config.mode !== 'production' && options.hot !== false;
    },

    resolveId(id) {
      if (id === virtual) return id;
    },

    load(id) {
      if (id === resolved_virtual) return id;
    },
    async transform(source, id) {

      const regx = /\.[mc]?[tj]sx$/i.test(id);

      if (!regx) return;


      const rely = ({ types }: any) => {
        return {
          visitor: {
            Program(path: { node: { body: babel.types.ImportDeclaration[]; }; }) {
              path.node.body.unshift(
                babel.types.importDeclaration(
                  [
                    babel.types.importNamespaceSpecifier(
                      babel.types.identifier('Soften')
                    )
                  ],  // 使用 * 号导入
                  babel.types.stringLiteral('@')
                )
              );
            },
            CallExpression(path: any) {
              const callee = path.node.callee;

              const block = ({
                types,
                argument,
                name,
              }) => {
                const util = types.arrowFunctionExpression(
                  [],
                  types.blockStatement([
                    types.returnStatement(
                      argument
                    )
                  ])
                );
                return types.callExpression(
                  types.identifier(name),
                  [util],
                )
              }

              const state = (is) => {
                return path?.node?.arguments?.map((argument: any, index) => {
                  // 处理三元运算符
                  if (types.isConditional(argument) ||
                    types.isLogicalExpression(argument)
                  ) {
                    return block({
                      argument,
                      name: 'Soften.createDetermine',
                      types,
                    })
                  }
                  if (index !== 0 && types.isIdentifier(argument) ||
                    types.isMemberExpression(argument)) {
                    return block({
                      argument,
                      name: 'Soften.createContent',
                      types,
                    })
                  }
                  if (is) {
                    if (index === 1 && types.isObjectExpression(argument)) {
                      return block({
                        argument,
                        name: 'Soften.createAttribute',
                        types,
                      })
                    }
                  }
                  return argument;
                })
              }

              if (
                types.isMemberExpression(callee) &&
                types.isIdentifier(callee.object, { name: "React" }) &&
                types.isIdentifier(callee.property, { name: "createElement" })
              ) {
                // 获取参数
                const args = state(true);

                const func = types.isIdentifier(path.node.arguments?.[0]) ||
                  types.isMemberExpression(path.node.arguments?.[0]);
                  
                const util = types.arrowFunctionExpression(
                  [],
                  types.blockStatement([
                    types.returnStatement(
                      types.arrayExpression(
                        args
                      )
                    )
                  ])
                );
                path.replaceWith(
                  types.callExpression(
                    types.identifier(func ? 'Soften.createComponent' : 'Soften.createElement'),
                    func ? state(false) : [util]
                  )
                )
              }
            },
          },
        }
      }

      const option = {
        babelrc: false,
        ast: true,
        presets: [
          '@babel/preset-typescript'
        ],
        plugins: [
          [
            '@babel/plugin-transform-react-jsx',
            {
              throwIfNamespace: false
            },
          ],
          rely,
        ],
        // sourceMaps: needSourceMap,
        sourceFileName: id,
        configFile: false,
        filename: id,
      };

      const result = await babel.transformAsync(source, option) as {
        code: string;
        map: any;
      };
      return {
        code: result.code,
        map: result.map,
      };
    },
  }
}