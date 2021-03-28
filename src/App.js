import React from 'react';
import Big from 'big.js';
import PropTypes from 'prop-types';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: null,
      next: null,
      operation: null,
      currentButton: null,
    };
  }

  handleClick(buttonName) {
    const newCalculations = calculate(this.state, buttonName);
    this.setState({ ...newCalculations, currentButton: buttonName });
  }

  render() {
    const { next, total, currentButton } = this.state;
    return (
      <div className="calculator">
        <Display currentButton={currentButton} result={next || total} />
        <ButtonPannel clickHandler={i => this.handleClick(i)} />
      </div>
    );
  }
}
const Button = ({ name, handleClick }) => (
  <button
    type="button"
    id={`button-${name}`}
    onClick={handleClick}
    className="btn"
  >
    {name}
  </button>
);

Button.propTypes = {
  name: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};
const Display = ({ result, currentButton }) => (
  <div className="calculator__screen">
    <div className="calculator__operation">{currentButton}</div>
    <div className="calculator__result" id="display">
      {result || '0'}
    </div>
  </div>
);

Display.propTypes = {
  result: PropTypes.string,
  currentButton: PropTypes.string,
};

Display.defaultProps = {
  result: '0',
  currentButton: '',
};
const buttonsLabel = [
  { group: ['AC', '+/-', '%', '÷'], id: 'group-one' },
  { group: ['7', '8', '9', 'X'], id: 'group-two' },
  { group: ['4', '5', '6', '-'], id: 'group-three' },
  { group: ['1', '2', '3', '+'], id: 'group-four' },
  { group: ['0', '.', '=', ''], id: 'group-five' },
];
class ButtonPannel extends React.Component {
  renderButtonGroup({ group, key }) {
    const { clickHandler } = this.props;
    const buttonGroups = group.map(label => (
      <Button
        key={label}
        name={label}
        handleClick={() => clickHandler(label)}
      />
    ));
    return (
      <div key={key} className="calculator__buttons">
        {buttonGroups}
      </div>
    );
  }

  render() {
    const buttonPannel = buttonsLabel
      .map(({ group, id }) => this.renderButtonGroup({ group, id, key: id }));

    return buttonPannel;
  }
}

ButtonPannel.propTypes = {
  clickHandler: PropTypes.func.isRequired,
};

const calculate = (data, buttonName) => {
  const { total, next, operation } = data;
  const operations = ['+', 'X', '-', '%', '÷'];
  let newTotal = total;
  let newNext = next;
  let newOperation = operation;

  if (buttonName === 'AC') {
    newTotal = null;
    newNext = null;
    newOperation = null;
  } else if (buttonName === '+/-') {
    if (next) {
      newNext = operate(next, '-1', 'X');
    } else if (total) {
      newTotal = operate(total, '-1', 'X');
    }
  } else if (buttonName === '=') {
    if (operation && total && next) {
      newNext = null;
      newTotal = operate(total, next, operation);
      newOperation = null;
    }
  } else if (operations.includes(buttonName)) {
    newNext = null;
    newOperation = buttonName;
    if (total && next && operation) {
      newTotal = operate(total, next, operation);
    } else if (next) {
      newTotal = next;
    }
  } else if (next) {
    newNext = next + buttonName;
  } else {
    newNext = buttonName;
  }
  return { operation: newOperation, total: newTotal, next: newNext };
};
const operate = (firstOperand, secondOperand, operation) => {
  const operand = Big(firstOperand);

  switch (operation) {
    case '+':
      return operand.plus(secondOperand).toString();
    case '-':
      return operand.minus(secondOperand).toString();
    case 'X':
      return operand.times(secondOperand).toString();
    case '÷':
      if (secondOperand === '0') {
        return '0';
      }
      return operand.div(secondOperand).toString();
    case '%':
      return operand.mod(secondOperand).toString();
    default:
      break;
  }

  return firstOperand;
};



export default App;
