import createContent from "./create-content";
import createList from "./create-list"

type content = null | number | false | string | [];
type list = [];
type  IExpression = () => content | list;
const expression_stack = [];
export default function createExpression(expression: IExpression) {
	const execute = () => {
		expression_stack.push(executes);
		try {
			const node = expression();
			console.log(node)
			if (Array.isArray(node)) {
				expression_stack.pop();
				return node;
			}
			const subscriber = node instanceof Array ? createList(node) : createContent(node);

			executes.subscriber = subscriber;

			return subscriber();
		} finally {
			expression_stack.pop();
		}
	}

	const executes: Execute = {
		subscriber: () => null,
	}

	return execute();
}