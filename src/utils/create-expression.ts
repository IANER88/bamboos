import createContent from "./create-content";
import createList from "./create-list"

type content = null | number | false | string | [];
type list = [];
type IExpression = () => content | list;
export const expression_stack = [];
export default function createExpression(expression: IExpression) {
	const execute = () => {
		expression_stack.push(executes);
		try {
			const node = expression();
			if (Array.isArray(node)) {
				expression_stack.pop();
				return node;
			}

			const subscriber = node instanceof Array ?
				createList(expression) :
				createContent(expression);
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