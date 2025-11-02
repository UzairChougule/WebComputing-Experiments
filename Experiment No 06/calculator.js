const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function startCalculator() {
    rl.question('Enter the first number: ', (num1Str) => {
        const num1 = parseFloat(num1Str);

        if (isNaN(num1)) {
            console.log('Invalid input. Please enter a valid number.');
            startCalculator();
            return;
        }

        rl.question('Enter the operator (+, -, *, /): ', (operator) => {
            if (!['+', '-', '*', '/'].includes(operator)) {
                console.log('Invalid operator. Please use one of +, -, *, /.');
                startCalculator();
                return;
            }

            rl.question('Enter the second number: ', (num2Str) => {
                const num2 = parseFloat(num2Str);
                if (isNaN(num2)) {
                    console.log('Invalid input. Please enter a valid number.');
                    startCalculator();
                    return;
                }

                let result;
                switch (operator) {
                    case '+':
                        result = num1 + num2;
                        break;
                    case '-':
                        result = num1 - num2;
                        break;
                    case '*':
                        result = num1 * num2;
                        break;
                    case '/':
                        if (num2 === 0) {
                            console.log('Error: Division by zero is not allowed.');
                            startCalculator();
                            return;
                        }
                        result = num1 / num2;
                        break;
                }

                console.log(`\nResult: ${num1} ${operator} ${num2} = ${result}`);
                askForAnotherCalculation();
            });
        });
    });
}

function askForAnotherCalculation() {
    rl.question('\nPerform another calculation? (yes/no): ', (answer) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
            startCalculator();
        } else {
            console.log('Goodbye!');
            rl.close();
        }
    });
}


console.log('--- Node.js Command-Line Calculator ---');
startCalculator();