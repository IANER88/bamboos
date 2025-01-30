import createContent from "./create-content";
import createList from "./create-list"

type content = null | number | false | string | [];
type IExpression = () => content | [];
export const expression_stack = [];
export default function createExpression(expression: IExpression) {
	const execute = () => {
		expression_stack.push(executes);
		try {
			const node = expression();

			const subscriber = node instanceof Array ?
				createList(expression) :
				createContent(expression);

			executes.subscriber = subscriber;

			return subscriber();
		} finally {
			expression_stack.pop();
		}
	}

	const executes = {
		subscriber: () => null,
	}

	return execute();
}