import { ancestor } from 'acorn-walk';
import { generate } from 'astring';
import {
  parseScript,
  getRealScriptAST,
  modifyObjProps,
  findObjCreateNull,
  findObjPreventExtensions,
  findObjFreeze,
  findPromiseCatch,
  replaceFromParentNode,
  findInitExpression,
} from './utils';
import {
  ArrowFunctionExpression,
  BlockStatement,
  CallExpression,
  Expression,
  ExpressionStatement,
  FunctionDeclaration,
  FunctionExpression,
  MemberExpression,
  Node,
  ObjectExpression,
  SequenceExpression,
  Statement, 
} from 'acorn';

const buildCustomInitFunction = (name: string, code: string) => (
`function ${name}() {
${code}
}`);

const buildSugarCubeExposeScript = (customExpose?: string[], customInit?: string[]) => ( /*javascript*/`
Object.defineProperty(window, '$SugarCube', {
  value: Object.freeze({
    LoadScreen,
    Alert,
    $init: {
      initEngine,
      ${customInit ? customInit.filter(e => e !== 'initEngine').join(',')  : ''}
    },
    ${customExpose ? customExpose.join(',')  : ''}
  }),
})`);

/**
 * Patch the original SugarCube script, expose some internal variables and the initial function.
 * 
 * @param script 
 * @param customExpose 
 * @param customInit 
 * @returns 
 */
export const patchEngineScript = (
  script: string,
  customExpose?: string[],
  customInit?: { [name: string]: string }
) => {
  const pushToASTBody = (ast: ExpressionStatement, ...statements: Statement[]) => (
    (
      (
        (ast.expression as CallExpression).callee as FunctionExpression
      ).body as BlockStatement
    ).body.push(...statements)
  );

  const ast = parseScript(script);
  const realAST = getRealScriptAST(ast);
  let initFuncAST: FunctionExpression | ArrowFunctionExpression | null = null;

  // console.log(realAST);

  ancestor(realAST, {
    CallExpression: (node, _, ancestors) => {
      // Parse `Object.create(null, {...})`, make objects writable and configurable
      if (findObjCreateNull(node)) {
        modifyObjProps(node.arguments[1] as ObjectExpression);
        node.arguments[0] = {
          type: 'ObjectExpression',
          properties: [],
          start: -1,
          end: -1,
        };
      }
      
      // Replace `Object.preventExtensions({...})`
      if (findObjPreventExtensions(node)) {
        const arg = node.arguments[0] as Expression;
        const parent = ancestors[ancestors.length - 2];
        replaceFromParentNode(parent, node, arg);
      }

      // Replace `Object.freeze({...})`
      if (findObjFreeze(node)) {
        const arg = node.arguments[0] as Expression;
        const parent = ancestors[ancestors.length - 2];
        replaceFromParentNode(parent, node, arg);
      }

      // Find & remove init function
      if (findInitExpression(node)) {
        const result = node.arguments[0] as FunctionExpression | ArrowFunctionExpression;
        const parent = ancestors[ancestors.length - 2] as SequenceExpression;

        const index = parent.expressions.findIndex(e => e === node);
        parent.expressions.splice(index, 1);
        initFuncAST = result;
        // console.log(result);
        
        // if (result.type === 'ArrowFunctionExpression') {
        //   initFuncAST = {
        //     type: 'VariableDeclaration',
        //     declarations: [{
        //       type: 'VariableDeclarator',
        //       id: {
        //         type: 'Identifier',
        //         name: 'initEngine',
        //         start: -1,
        //         end: -1,
        //       },
        //       init: result,
        //       start: -1,
        //       end: -1
        //     }],
        //     kind: 'const',
        //     start: -1,
        //     end: -1
        //   };
        //   console.log(initFuncAST);
        // }
      }
    },
  });

  if (!initFuncAST)
    throw new Error('Cannot find engine init function');
  
  // Finds the real init code
  let initCodeAST: Node | null = null;
  ancestor(initFuncAST, {
    TryStatement: (node, _, ancestors) => {
      console.log('try {} catch {}');
      console.log(node);
      // TODO
    },

    CallExpression: (node) => {
      if (!findPromiseCatch(node)) return;
      console.log('new Promise.then().catch()');
      initCodeAST = (node.callee as MemberExpression).object as CallExpression;
    },
  });

  console.log(initCodeAST);
  if (!initCodeAST)
    throw new Error('Cannot find engine init code');

  // Parse init code, remove `LoadScreen` calls and, if not, convert it to promise.
  let initFuncFinal: FunctionDeclaration | null = null;
  ancestor(initCodeAST, {
    CallExpression: (node, _, ancestors) => {
      if (
        node.callee.type !== 'MemberExpression' ||
        node.callee.object.type !== 'Identifier' ||
        node.callee.object.name !== 'LoadScreen'
      ) return;

      const parent = ancestors[ancestors.length - 2] as Statement;
      if (parent.type === 'ReturnStatement') {
        parent.argument = null;
      }
    },
  });

  // Generate new init function
  if ((initCodeAST as CallExpression).type === 'CallExpression') { // new Promise().then()
    initFuncFinal = {
      type: 'FunctionDeclaration',
      id: {
        type: 'Identifier',
        name: 'initEngine',
        start: -1,
        end: -1,
      },
      body: {
        type: 'BlockStatement',
        body: [{
          type: 'ReturnStatement',
          argument: initCodeAST as CallExpression,
          start: -1,
          end: -1,
        }],
        start: 0,
        end: 0
      },
      params: [],
      generator: false,
      expression: false,
      async: false,
      start: -1,
      end: -1,
    };
  }

  // If custom `initEngine` found, we will skip this and use the custom one.
  if (
    !initFuncFinal ||
    !customInit ||
    Object.keys(customInit).findIndex(e => e === 'initEngine') === -1
  )
    pushToASTBody(realAST, initFuncFinal as unknown as FunctionDeclaration);

  // Build custom init function & exports
  let customScriptStr = '';
  if (customInit) {
    for (const name in customInit) {
      customScriptStr += buildCustomInitFunction(name, customInit[name]);
    }
  }
  customScriptStr += buildSugarCubeExposeScript(customExpose, Object.keys(customInit ?? {}));
  pushToASTBody(realAST, ...parseScript(customScriptStr).body as (Statement | FunctionDeclaration)[]);

  const scriptResult = generate(realAST);
  
  console.log(scriptResult);

  return scriptResult;
};
