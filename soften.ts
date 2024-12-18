import * as babel from '@babel/core';
import generator from '@babel/generator'
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

      const tsx = /\.[mc]?[tj]sx$/i.test(id);

      if (!tsx) return;

      const effect = ({ types }) => {

        const CallExpression = (path) => {

        }

        const Program = (path) => {


        }

        const transform = (node) => {
          if (node.type === 'JSXElement') {
            const name = node.openingElement.name.name;
            const tag = types.identifier(name);
  
            const component = name[0] === name[0].toUpperCase();
            if (component) {
              const children = types.objectMethod(
                'get',
                types.identifier('children'),
                [],
                types.blockStatement([
                  types.returnStatement(
                    types.arrayExpression(
                      node.children.map(child => transform(child))
                    )
                  )
                ])
              )
              const createSection =  types.objectExpression(
                [
                  ...node.openingElement.attributes.map(attr => {
                    return types.objectMethod(
                      'get',
                      types.identifier(attr.name.name),
                      [],
                      types.blockStatement([
                        types.returnStatement(attr.value.value)
                      ])
                    )
                  }),
                  children,
                ]
              )
              return types.callExpression(
                types.identifier(
                  'Soften.createSection',
                ),
                [
                  tag,
                  createSection
                ],
              )
            }
            const attributes = types.objectExpression(
              [
                ...node.openingElement.attributes.map(attr => {
                  return types.objectProperty(
                    types.stringLiteral(attr.name.name),
                    attr.value.value,
                  )
                }),
              ]
            );
          
            return types.callExpression(
              types.identifier('Soften.createElement'),
              [types.stringLiteral(name), attributes],
            )
          }
          if (node.type === 'JSXText') {
            return node.value.trim()
          }
          if (node.type === 'JSXExpressionContainer') {
            return types.identifier(node.expression.type)
          }
        }

        const JSXElement = (path) => {
          const node = path.node;

          const element = transform(node);
          console.log(element);


          path.replaceWith(element)
        }

        // const JSXExpressionContainer = (path) => {
        //   const jsxExpressionCode = generator.default(path.node).code;
        //   console.log('Found JSX Expression Container:', jsxExpressionCode)
        // }

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