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
                  babel.types.stringLiteral('@/utils')
                )
              );
            },
            CallExpression(path: any) {
              const callee = path.node.callee;

              const test = (node: unknown) => {
                return types.isIdentifier(node) ||
                  types.isMemberExpression(node);
              }

              type Options = {
                argument: unknown;
                name?: string;
              }

              const block = (options: Options) => {
                const {
                  argument,
                  name,
                } = options;
                const util = types.arrowFunctionExpression(
                  [],
                  types.blockStatement([
                    types.returnStatement(
                      argument
                    )
                  ])
                );
                return name ? types.callExpression(
                  types.identifier(name),
                  [util],
                ) : util
              }

              const state = (is: boolean) => {
                const node = path?.node?.arguments?.map((argument: any, index: number) => {
                  // 处理三元运算符
                  if (types.isConditional(argument) ||
                    types.isLogicalExpression(argument)
                  ) {
                    const test = argument.test;
                    const consequent = argument.consequent;
                    const alternate = argument.alternate;

                    const arrow = types.arrowFunctionExpression(
                      [],
                      types.blockStatement([
                        types.returnStatement(
                          types.conditionalExpression(
                            test,
                            block({
                              argument: consequent,
                              name: 'Soften.createContent'
                            }),
                            block({
                              argument: alternate,
                              name: 'Soften.createContent'
                            }),
                          )
                        )
                      ])
                    );
                    return types.callExpression(
                      types.identifier('Soften.createDetermine'),
                      [arrow]
                    )
                  }
                  if (index !== 0 && test(argument)) {
                    return block({
                      argument,
                      name: 'Soften.createContent',
                    })
                  }
                  if (types.isObjectExpression(argument)) {
                    argument.properties.forEach((view: any, index: number) => {
                      if (test(view.value) || types.isExpression(view.value)) {
                        if (is) {
                          view.value = block({
                            argument: view.value,
                            name: 'Soften.createAttribute',
                          })
                        } else {
                          argument.properties[index] = types.objectMethod(
                            'get',
                            view.key,
                            [],
                            types.blockStatement([
                              types.returnStatement(
                                view.value
                              )
                            ])
                          )
                        }
                      }
                    });
                    if (!is) {
                      const children = path.node.arguments.slice(2).map(
                        (item: unknown) => {
                          if (test(item)) {
                            return block({
                              argument: item,
                              name: 'Soften.createContent'
                            })
                          }
                          return item;
                        }
                      );
                      const get_children = types.objectMethod(
                        'get',
                        types.identifier('children'),
                        [],
                        types.blockStatement([
                          types.returnStatement(
                            types.arrayExpression(
                              children
                            )
                          )
                        ])
                      )
                      argument.properties.push(get_children)
                    }
                    return argument
                  }
                  return argument;
                });

                return is ? node : node.slice(0, 2);
              }

              if (
                types.isMemberExpression(callee) &&
                types.isIdentifier(callee.object, { name: "React" }) &&
                types.isIdentifier(callee.property, { name: "createElement" })
              ) {
                const func = test(path.node.arguments?.[0]);
                path.replaceWith(
                  types.callExpression(
                    types.identifier(func ? 'Soften.createComponent' : 'Soften.createElement'),
                    func ? state(false) : state(true)
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