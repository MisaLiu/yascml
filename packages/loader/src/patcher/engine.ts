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
  findSCDefine,
  replaceFromParentNode,
  findInitExpression,
  createFunction,
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
  ObjectExpression,
  SequenceExpression,
  Statement,
  VariableDeclarator, 
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
      }
    },
  });

  if (!initFuncAST)
    throw new Error('Cannot find engine init function');
  
  // Finds the real init code
  let initCodeAST: CallExpression | BlockStatement | null = null;
  ancestor(initFuncAST, { // new Promise().then().catch()
    CallExpression: (node) => {
      if (!findPromiseCatch(node)) return;
      initCodeAST = (node.callee as MemberExpression).object as CallExpression;
    },
  });

  if (!initCodeAST) { // try {} catch {}
    ancestor(initFuncAST, {
      TryStatement: (node) => {
        initCodeAST = node.block;
      },
    });
  }

  if (!initCodeAST)
    throw new Error('Cannot find engine init code');

  // Parse init code, remove `LoadScreen` calls
  ancestor(initCodeAST, { // new Promise().then();
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

  if ((initCodeAST as BlockStatement).type === 'BlockStatement') {
    ancestor(initCodeAST, { // try {} catch {}
      CallExpression: (node, _, ancestors) => {
        if (
          node.callee.type !== 'MemberExpression' ||
          node.callee.object.type !== 'Identifier' ||
          node.callee.object.name !== 'LoadScreen'
        ) return;

        const parent = ancestors[ancestors.length - 2] as Expression | VariableDeclarator;
        if (parent.type === 'VariableDeclarator') {
          parent.init = {
            type: 'Literal',
            value: null,
            start: -1,
            end: -1,
          };
        } else if (parent.type === 'SequenceExpression') {
          const index = parent.expressions.findIndex(e => e === node);
          parent.expressions.splice(index, 1);
        } else if (parent.type === 'ArrowFunctionExpression') {
          // Replace `LoadScreen.unlock()` with `resolve()`
          parent.body = {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'resolve',
              start: -1,
              end: -1,
            },
            arguments: [],
            optional: false,
            start: -1,
            end: -1,
          };
        }
      },
    });
  }

  console.log(initCodeAST);

  // If we found `Object.defineProperty(window, 'SugarCube', {...})` in init code, we extract it
  let defineCodeAST: ExpressionStatement | null = null;
  ancestor(initCodeAST, {
    CallExpression: (node, _, ancestors) => {
      if (!findSCDefine(node)) return;

      const _node = ancestors[ancestors.length - 2] as ExpressionStatement;
      const parent = ancestors[ancestors.length - 3] as BlockStatement;
      const index = parent.body.findIndex(e => e === _node);

      defineCodeAST = _node;
      parent.body.splice(index, 1);
    }
  });
  if (defineCodeAST) pushToASTBody(realAST, defineCodeAST);

  // Generate new init function
  let initFuncFinal: FunctionDeclaration | null = null;
  if ((initCodeAST as CallExpression).type === 'CallExpression') { // new Promise().then()
    initFuncFinal = createFunction('initEngine', [{
      type: 'ReturnStatement',
      argument: initCodeAST,
      start: -1,
      end: -1,
    }]);
  } else if ((initCodeAST as BlockStatement).type === 'BlockStatement') { // try {} catch {}
    initFuncFinal = createFunction('initEngine', [{
      type: 'ReturnStatement',
      argument: {
        type: 'NewExpression',
        callee: {
          type: 'Identifier',
          name: 'Promise',
          start: -1,
          end: -1,
        },
        arguments: [{
          type: 'ArrowFunctionExpression',
          params: [{
            type: 'Identifier',
            name: 'resolve',
            start: -1,
            end: -1,
          }],
          body: initCodeAST,
          expression: false,
          generator: false,
          async: false,
          start: -1,
          end: -1,
        }],
        start: -1,
        end: -1,
      },
      start: -1,
      end: -1,
    }]);
  }

  // If custom `initEngine` found, we will skip this and use the custom one.
  if (
    initFuncFinal &&
    (!customInit || Object.keys(customInit).findIndex(e => e === 'initEngine') === -1)
  )
    pushToASTBody(realAST, initFuncFinal);

  // Build custom init function & exports
  let customScriptStr = '';
  if (customInit) {
    for (const name in customInit) {
      customScriptStr += buildCustomInitFunction(name, customInit[name]);
    }
  }
  customScriptStr += buildSugarCubeExposeScript(customExpose, Object.keys(customInit ?? {}));
  pushToASTBody(realAST, ...parseScript(customScriptStr).body as (Statement | FunctionDeclaration)[]);

  // finish patching
  return generate(realAST);
};
