import * as babel from '@babel/core';
import generator from '@babel/generator'
import type {Plugin} from 'vite'

export default function BamboosJSX(): Plugin {
  const virtual = 'virtual:bamboos-dom'
  const resolved_virtual = '\0' + virtual;

  return {
    name: 'bamboos',
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

      const tsx = /\.[mc]?[tj]sx$/i.test(id);

      if (!tsx) return;

      const effect = ({types}) => {

        const CallExpression = (path) => {

        }

        const Program = (path) => {
          const {node: {body}} = path;
          body.unshift(
            babel.types.importDeclaration(
              [
                babel.types.importNamespaceSpecifier(
                  babel.types.identifier('Bamboos')
                )
              ],  // 使用 * 号导入
              babel.types.stringLiteral('@/utils')
            )
          );

        }

        const transform = (node) => {
          if (node.type === 'JSXText' && node?.value?.trim()?.length) {
            return types.stringLiteral(node.value.replace(/\s*\n\s*/g, ''))
          }

          if (node.type === 'JSXExpressionContainer') {

            const createExpression = types.callExpression(
              types.identifier('Bamboos.createExpression'),
              [
                types.arrowFunctionExpression(
                  [],
                  node.expression
                )
              ]
            )

            return createExpression;
          }
          if (node.type === 'JSXElement') {
            const name = node.openingElement.name.name;
            const tag = types.identifier(name);

            const component = name[0] === name[0].toUpperCase();
            const attributes = types.objectExpression(
              [
                ...node.openingElement.attributes.map((attribute) => {
                  const namespace = [
                    attribute?.name?.namespace?.name,
                    attribute?.name?.name?.name
                  ]
                  const [namespaced] = namespace;
                  const namespace_name = types.isJSXNamespacedName(attribute.name);

                  const on = /^on/;
                  const name = namespace_name ?
                    namespace.join(':') : attribute.name.name

                  const container = types.isJSXExpressionContainer(attribute.value);


                  const create = (name: string) => {
                    const createEvent = () => {
                      return types.arrayExpression(
                        [
                          types.stringLiteral(attribute?.name?.name?.name),
                          types.arrowFunctionExpression(
                            [],
                            attribute?.value?.expression
                          )
                        ]
                      )
                    };

                    const createAttribute = () => {
                      return types.arrayExpression(
                        [
                          types.stringLiteral(attribute?.name?.name),
                          types.arrowFunctionExpression(
                            [],
                            attribute?.value?.expression
                          )
                        ]
                      )
                    }
                    const bind = types.callExpression(
                      types.memberExpression(
                        types.identifier(name),
                        types.identifier('apply'),
                      ),
                      [
                        types.thisExpression(),
                        types.arrayExpression(
                          [
                            name === 'Bamboos.createEvent' ? createEvent() :
                              createAttribute()
                          ]
                        )
                      ]
                    )

                    return types.functionExpression(
                      null,
                      [],
                      types.blockStatement(
                        [
                          types.expressionStatement(
                            bind
                          )
                        ]
                      )
                    )
                  }

                  console.log(name, container)
                  return types.objectProperty(
                    types.stringLiteral(name),
                    namespace_name && on.test(namespaced)
                      ? create('Bamboos.createEvent') :
                      container ? create('Bamboos.createAttribute') : attribute.value
                  )
                }),
              ]
            );
            // const children = types.objectMethod(
            //   'get',
            //   types.identifier('children'),
            //   [],
            //   types.blockStatement([
            //     types.returnStatement(
            //       types.arrayExpression(
            //         node.children.map(child => transform(child))
            //       )
            //     )
            //   ])
            // )
            if (component) {
              return types.callExpression(
                types.identifier(
                  'Bamboos.createComponent',
                ),
                [
                  tag,
                  attributes
                ],
              )
            }

            return types.callExpression(
              types.identifier('Bamboos.createElement'),
              [
                types.stringLiteral(name),
                attributes,
                ...node.children.map(transform).filter(Boolean)
              ],
            )
          }
        }

        const JSXElement = (path) => {
          const node = path.node;

          const element = transform(node);

          path.replaceWith(element)
        }

        return {
          visitor: {
            Program,
            CallExpression,
            JSXElement,
          }
        }
      }

      const option = {
        babelrc: false,
        ast: true,
        presets: [
          '@babel/preset-typescript'
        ],
        plugins: [
          effect,
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