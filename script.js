    const display = document.getElementById('display');
    let expression = '';
    let resultDisplayed = false;

    const add = (a, b) => a + b;
    const subtract = (a, b) => a - b;
    const multiply = (a, b) => a * b;
    const divide = (a, b) => b === 0 ? 'Nope' : a / b;

    const operate = (op, a, b) => {
      a = parseFloat(a);
      b = parseFloat(b);
      switch(op) {
        case '+': return add(a, b);
        case '-': return subtract(a, b);
        case '*': return multiply(a, b);
        case '/': return divide(a, b);
      }
    };

    const updateDisplay = (val) => {
      display.textContent = val;
    };

    const isOperator = (char) => ['+', '-', '*', '/'].includes(char);

    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        const val = button.textContent;

        if (button.classList.contains('clear')) {
          expression = '';
          updateDisplay('0');
          return;
        }

        if (button.classList.contains('back')) {
          expression = expression.slice(0, -1);
          updateDisplay(expression || '0');
          return;
        }

        if (button.classList.contains('equal')) {
          try {
            if (/([+\-*/]{2,})/.test(expression)) {
              updateDisplay('Syntax Error');
              expression = '';
              return;
            }
            let result = Function(`return ${expression}`)();
            result = (typeof result === 'number' && !Number.isInteger(result)) ? result.toFixed(2) : result;
            updateDisplay(result);
            expression = result.toString();
            resultDisplayed = true;
          } catch {
            updateDisplay('Syntax Error');
            expression = '';
          }
          return;
        }

        if (button.classList.contains('dot')) {
          const parts = expression.split(/[-+*/]/);
          if (!parts[parts.length - 1].includes('.')) {
            expression += '.';
            updateDisplay(expression);
          }
          return;
        }

        if (!isNaN(val) || isOperator(val)) {
          if (resultDisplayed && !isOperator(val)) {
            expression = val;
            resultDisplayed = false;
          } else {
            const lastChar = expression.slice(-1);
            if (isOperator(lastChar) && isOperator(val)) {
              // prevent chaining multiple operators
              updateDisplay('Syntax Error');
              expression = '';
              return;
            }
            expression += val;
          }
          updateDisplay(expression);
        }
      });
    });

    document.addEventListener('keydown', e => {
      const key = e.key;
      const map = {
        'Enter': '=',
        'Backspace': '←',
        'c': 'C'
      };
      const val = map[key] || key;
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent === val);
      if (btn) btn.click();
    });